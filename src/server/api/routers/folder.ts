import { eq } from "drizzle-orm";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { FOLDER } from "~/server/db/schema";

export const postRouter = createTRPCRouter({
  getFolders: protectedProcedure.
  input(z.object({}))
  .use(async (options) => options.next({ ctx: options.ctx })) 
  .query(async ({ ctx }) => {
    const folders = await ctx.db.query.FOLDER.findMany({
      where: eq(FOLDER.authorId, ctx.session.user.id),
      orderBy: (folders, { desc }) => [desc(folders.createdAt)],
    });
    return folders;
  }),
  getFolder: protectedProcedure.
  input(z.object({ id: z.string() }))
  .use(async (options) => options.next({ ctx: options.ctx })) 
  .query(async ({ input, ctx }) => {
    const folder = await ctx.db.query.FOLDER.findOne({
      where: eq(FOLDER.id, input.id),
      include: {
        author: true,
      },
    });
    return folder;
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
