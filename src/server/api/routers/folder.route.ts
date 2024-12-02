import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { subject } from "@casl/ability";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { FOLDER, FOLDER_LIST } from "~/server/db/schema";
import {
  folderCreateSchema,
  folderUpdateSchema,
  Folder,
} from "~/server/db/folder.schema";
import { accessControl } from "~/access-control/access-control-middleware";
import { singleOrThrow, singleOrThrowItem } from "~/server/db/utils";
import { TRPCError } from "@trpc/server";
import {
  FolderList,
  folderListCreateSchema,
  folderListUpdateSchema,
} from "~/server/db/folder-list.schema";
import { List, LIST, listCreateSchema } from "~/server/db/list.schema";
import * as schema from "~/server/db/schema";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

type FolderListWithList = FolderList & { list: List };
type FolderWithLists = Folder & { lists: FolderListWithList[] };

let cache: {
  folderWithLists: FolderWithLists | null;
} = {
  folderWithLists: null,
};

const getFolderWithLists = async (
  folderId: string,
  db: PostgresJsDatabase<typeof schema>,
): Promise<FolderWithLists> => {
  const folderWithLists = await db.query.FOLDER.findFirst({
    where: eq(FOLDER.id, folderId),
    with: {
      author: true,
      lists: {
        orderBy: desc(FOLDER_LIST.orderInFolder),
        with: {
          list: true,
        },
      },
    },
  }).then(singleOrThrow);
  return folderWithLists;
};

export const folderRouter = createTRPCRouter({

  getFolders: protectedProcedure
    .input(z.object({}))
    .use((opt) => opt.next())
    .query(async ({ ctx }) => {
      const folders = await ctx.db.query.FOLDER.findMany({
        where: eq(FOLDER.authorId, ctx.session.user.id),
        orderBy: desc(FOLDER.createdAt),
      });
      return folders;
    }),

  getFolder: protectedProcedure
    .input(z.object({ id: z.string() }))
    .use(
      accessControl(async (option, userAbility) => {
        const folderWithLists = await getFolderWithLists(
          option.input.id,
          option.ctx.db,
        );
        cache.folderWithLists = folderWithLists;
        return userAbility.can("read", subject("FOLDER", folderWithLists));
      }),
    )
    .query(async ({ input, ctx }) => cache.folderWithLists),

  createFolder: protectedProcedure
    .input(folderCreateSchema)
    .use(
      accessControl(async ({ ctx }, userAbility) =>
        userAbility.can("create", subject("FOLDER", ctx.session.user)),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      const folder = await ctx.db
        .insert(FOLDER)
        .values(input)
        .returning()
        .then(singleOrThrow);
      return folder;
    }),

  updateFolder: protectedProcedure
    .input(folderUpdateSchema)
    .use(
      accessControl(async (options, userAbility) => {
        const { id } = options.input;
        const folder = await options.ctx.db
          .select()
          .from(FOLDER)
          .where(eq(FOLDER.id, id))
          .then(singleOrThrow);
        return userAbility.can("update", subject("FOLDER", folder));
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updatedFolderWithLists = await ctx.db.transaction(async (tx) => {
        const _updatedFolder = await ctx.db
          .update(FOLDER)
          .set(input)
          .where(eq(FOLDER.id, input.id))
          .returning()
          .then(singleOrThrow);
        const folderWithLists = await getFolderWithLists(input.id, tx);
        return folderWithLists;
      });
      return updatedFolderWithLists;
    }),

  deleteFolder: protectedProcedure
    .input(folderUpdateSchema)
    .use(
      accessControl(async (options, userAbility) => {
        const { id } = options.input;
        const folder = await options.ctx.db
          .select()
          .from(FOLDER)
          .where(eq(FOLDER.id, id))
          .then(singleOrThrow);
        return userAbility.can("delete", subject("FOLDER", folder));
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const deletedFolder = await ctx.db.transaction(async (tx) => {
        const deletedFolderLists = await tx
          .delete(FOLDER_LIST)
          .where(eq(FOLDER_LIST.folderId, input.id))
          .returning();
        const _deletedFolder = await ctx.db
          .delete(FOLDER)
          .where(eq(FOLDER.id, input.id))
          .returning()
          .then(singleOrThrow);
        return _deletedFolder;
      });
      return deletedFolder;
    }),

  // addListToFolder
  addListToFolder: protectedProcedure
    .input(folderListCreateSchema)
    .use(
      accessControl(async ({ ctx, input }, userAbility) => {
        const folderId = input.folderId;
        const folderWithLists = await getFolderWithLists(folderId, ctx.db);
        cache.folderWithLists = folderWithLists;
        return userAbility.can("add_list_to_folder", subject("Folder", folderWithLists));
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const folderWithLists = await ctx.db.transaction(async (tx) => {
        const cachedFolderWithLists = cache.folderWithLists!;
        const maxOrderInFolder = String(
          1 +
          Math.max(
            ...cachedFolderWithLists.lists.map((folderList) =>
              Number(folderList.orderInFolder),
            ),
          ),
        );

        const folderList = await ctx.db
          .insert(FOLDER_LIST)
          .values({ ...input, orderInFolder: maxOrderInFolder })
          .returning()
          .then(singleOrThrow);
        const _folderWithLists = await getFolderWithLists(input.folderId, tx);
        return _folderWithLists;
      });
      return folderWithLists;
    }),

  createAndAddAListToAFolder: protectedProcedure
    .input(z.object({ folderId: z.string().uuid(), list: listCreateSchema }))
    .use(
      accessControl(async ({ ctx, input }, userAbility) => {
        const folderId = input.folderId;
        const folderWithLists = await getFolderWithLists(folderId, ctx.db);
        cache.folderWithLists = folderWithLists;
        return (
          userAbility.can("add_list_to_folder", subject("Folder", folderWithLists)) &&
          userAbility.can("create", subject("LIST", input.list))
        );
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const folderWithLists = await ctx.db.transaction(async (tx) => {
        const createdList = await tx
          .insert(LIST)
          .values(input.list)
          .returning()
          .then(singleOrThrow);
        const cachedFolderWithLists = cache.folderWithLists!;
        const maxOrderInFolder = String(
          1 +
          Math.max(
            ...cachedFolderWithLists.lists.map((folderList) =>
              Number(folderList.orderInFolder),
            ),
          ),
        );

        await tx
          .insert(FOLDER_LIST)
          .values({
            ...input,
            listId: createdList.id,
            orderInFolder: maxOrderInFolder,
          })
          .returning()
          .then(singleOrThrow);
        const _folderWithLists = await getFolderWithLists(input.folderId, tx);
        return _folderWithLists;
      });
      return folderWithLists;
    }),

  removeAListFromFolder: protectedProcedure
    .input(folderListCreateSchema)
    .use(
      accessControl(async ({ ctx, input }, userAbility) => {
        const folderId = input.folderId;
        const folder = await ctx.db
          .select()
          .from(FOLDER)
          .where(eq(FOLDER.id, folderId))
          // .all()
          .then(singleOrThrow);
        return userAbility.can("remove_list_from_folder", subject("Folder", folder));
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const folderId = input.folderId;
      const listId = input.listId;
      const folderWithLists = await ctx.db.transaction(async (tx) => {
        await ctx.db
          .delete(FOLDER_LIST)
          .where(
            and(eq(FOLDER_LIST.folderId, folderId), eq(FOLDER_LIST.listId, listId)),
          );
        const _folderWithLists = await getFolderWithLists(folderId, tx);
        return _folderWithLists;
      });
      return folderWithLists;
    }),
  reorderAList: protectedProcedure
    .input(folderListUpdateSchema)
    .use(
      accessControl(async ({ ctx, input }, userAbility) => {
        const folderId = input.folderId;
        const folderWithLists = await getFolderWithLists(folderId, ctx.db);
        return userAbility.can(
          "reorder_lists_in_folder",
          subject("Folder", folderWithLists),
        );
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const folderWithLists = await ctx.db.transaction(async (tx) => {
        await tx
          .update(FOLDER_LIST)
          .set(input)
          .where(
            and(
              eq(FOLDER_LIST.folderId, input.folderId),
              eq(FOLDER_LIST.listId, input.listId),
            ),
          )
          .returning()
          .then(singleOrThrow);
        const _folderWithLists = await getFolderWithLists(input.folderId, tx);
        return _folderWithLists;
      });
      return folderWithLists;
    }),
  // reorderList
});
