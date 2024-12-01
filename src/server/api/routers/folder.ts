import { eq } from "drizzle-orm";
import { z } from "zod";
import { subject } from "@casl/ability";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { FOLDER } from "~/server/db/schema";
import { Folder } from "~/server/db/folder.schema";
import { accessControl } from "~/access-control/access-control-middleware";
import { singleOrThrowItem } from "~/server/db/utils";

let cache: {
  folder: Folder | null;
} = {
  folder: null,
};


export const postRouter = createTRPCRouter({
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
        }).then(singleOrThrowItem);
        cache.folder = folder;
        return userAbility.can("read", subject("FOLDER", folder));
      }),
    )
    .query(async ({ input, ctx }) => {
      return cache.folder;
      // const folder = await ctx.db.query.FOLDER.findFirst({
      //   where: eq(FOLDER.id, input.id),
      //   with: {
      //     author: true,
      //   },
      // }).then(singleOrThrow);
    }),
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))

    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(posts).values({
        name: input.name,
        createdById: ctx.session.user.id,
      });
    }),

  getLatest: protectedProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.query.posts.findFirst({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });
    return post ?? null;
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
