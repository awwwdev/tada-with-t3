import { eq } from "drizzle-orm";
import { z } from "zod";
import { subject } from "@casl/ability";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { FOLDER } from "~/server/db/schema";
import { Folder, folderCreateSchema, folderUpdateSchema } from "~/server/db/folder.schema";
import { accessControl } from "~/access-control/access-control-middleware";
import { singleOrThrow, singleOrThrowItem } from "~/server/db/utils";
import { TRPCError } from "@trpc/server";

let cache: {
  folder: Folder | null;
} = {
  folder: null,
};


export const folderRouter = createTRPCRouter({
  getFolders: protectedProcedure
    .input(z.object({}))
    .use((opt) => opt.next())
    .query(async ({ ctx }) => {
      const folders = await ctx.db.query.FOLDER.findMany({
        where: eq(FOLDER.authorId, ctx.session.user.id),
        orderBy: (folders, { desc }) => [desc(folders.createdAt)],
      });
      return folders;
    }),
  getFolder: protectedProcedure
    .input(z.object({ id: z.string() }))
    .use(
      accessControl(async (option, userAbility) => {
        const folder = await option.ctx.db.query.FOLDER.findFirst({
          where: eq(FOLDER.id, option.input.id),
          with: {
            author: true,
          },
        }).then(singleOrThrow);
        cache.folder = folder;
        return userAbility.can("read", subject("FOLDER", folder));
      }),
    )
    .query(async ({ input, ctx }) => cache.folder),



  createFolder: protectedProcedure
    .input(folderCreateSchema)
    .use(accessControl(
      async ({ ctx }, userAbility) => userAbility.can('create', subject('FOLDER', ctx.session.user))
    ))
    .mutation(async ({ ctx, input }) => {
      const folder = await ctx.db.insert(FOLDER).values(input).returning().then(singleOrThrow);
      return folder;
    }),

  updateFolder: protectedProcedure.input(folderUpdateSchema).use(accessControl(
    async (options, userAbility) => {
      const { id } = options.input
      const folder = await options.ctx.db.select().from(FOLDER).where(eq(FOLDER.id, id)).then(singleOrThrow);
      return userAbility.can('update', subject('FOLDER', folder))
    }
  )).mutation(async ({ ctx, input }) => {
    const folder = await ctx.db.update(FOLDER).set(input).where(eq(FOLDER.id, input.id)).returning().then(singleOrThrow);
    if (!folder) throw new TRPCError({ code: "NOT_FOUND" });
    return folder;
  }),

  deleteFolder: protectedProcedure.input(folderUpdateSchema).use(accessControl(
    async (options, userAbility) => {
      const { id } = options.input
      const folder = await options.ctx.db.select().from(FOLDER).where(eq(FOLDER.id, id)).then(singleOrThrow);
      return userAbility.can('delete', subject('FOLDER', folder))
    }
  )).mutation(async ({ ctx, input }) => {
    const folder = await ctx.db.delete(FOLDER).where(eq(FOLDER.id, input.id)).returning().then(singleOrThrow);
    if (!folder) throw new TRPCError({ code: "NOT_FOUND" });  
    return folder;
  }),


  // addFolderToList
  // removeFolderFromList
  // reorderFolder

});
