import { eq } from "drizzle-orm";
import { z } from "zod";
import { subject } from "@casl/ability";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { TASK } from "~/server/db/schema";
import { taskCreateSchema, taskUpdateSchema, Task } from "~/server/db/task.schema";
import { accessControl } from "~/access-control/access-control-middleware";
import { singleOrThrow, singleOrThrowItem } from "~/server/db/utils";
import { TRPCError } from "@trpc/server";

let cache: {
  task: Task | null;
} = {
  task: null,
};


export const userRouter = createTRPCRouter({

  // getUser: 
  // updateUserInfo
  // updateSettings
  // updatePassword
  // updateEmail
  // deleteAccount
  getTasks: protectedProcedure
    .input(z.object({}))
    .use((opt) => opt.next())
    .query(async ({ ctx }) => {
      const tasks = await ctx.db.query.TASK.findMany({
        where: eq(TASK.authorId, ctx.session.user.id),
        orderBy: (tasks, { desc }) => [desc(tasks.createdAt)],
      });
      return tasks;
    }),
  getTask: protectedProcedure
    .input(z.object({ id: z.string() }))
    .use(
      accessControl(async (option, userAbility) => {
        const task = await option.ctx.db.query.TASK.findFirst({
          where: eq(TASK.id, option.input.id),
          with: {
            author: true,
          },
        }).then(singleOrThrow);
        cache.task = task;
        return userAbility.can("read", subject("TASK", task));
      }),
    )
    .query(async ({ input, ctx }) => cache.task),
  createTask: protectedProcedure
    .input(taskCreateSchema)
    .use(accessControl(
      async ({ ctx }, userAbility) => userAbility.can('create', subject('TASK', ctx.session.user))
    ))
    .mutation(async ({ ctx, input }) => {
      const task = await ctx.db.insert(TASK).values(input).returning().then(singleOrThrow);
      return task;
    }),

  updateTask: protectedProcedure.input(taskUpdateSchema).use(accessControl(
    async (options, userAbility) => {
      const { id } = options.input
      const task = await options.ctx.db.select().from(TASK).where(eq(TASK.id, id)).then(singleOrThrow);
      return userAbility.can('update', subject('TASK', task))
    }
  )).mutation(async ({ ctx, input }) => {
    const task = await ctx.db.update(TASK).set(input).where(eq(TASK.id, input.id)).returning().then(singleOrThrow);
    if (!task) throw new TRPCError({ code: "NOT_FOUND" });
    return task;
  }),

  deleteTask: protectedProcedure.input(taskCreateSchema).use(accessControl(
    async (options, userAbility) => {
      const { id } = options.input
      const task = await options.ctx.db.select().from(TASK).where(eq(TASK.id, id)).then(singleOrThrow);
      return userAbility.can('delete', subject('TASK', task))
    }
  )).mutation(async ({ ctx, input }) => {
    const task = await ctx.db.delete(TASK).where(eq(TASK.id, input.id)).returning().then(singleOrThrow);
    if (!task) throw new TRPCError({ code: "NOT_FOUND" });
    return task;
  }),
});
