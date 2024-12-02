import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { subject } from "@casl/ability";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { LIST, LIST_TASK } from "~/server/db/schema";
import {
  listCreateSchema,
  listUpdateSchema,
  List,
} from "~/server/db/list.schema";
import { accessControl } from "~/access-control/access-control-middleware";
import { singleOrThrow, singleOrThrowItem } from "~/server/db/utils";
import { TRPCError } from "@trpc/server";
import {
  ListTask,
  listTaskCreateSchema,
  listTaskUpdateSchema,
} from "~/server/db/list-task.schema";
import { Task, TASK, taskCreateSchema } from "~/server/db/task.schema";
import * as schema from "~/server/db/schema";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

type ListTaskWithTask = ListTask & { task: Task };
type ListWithTasks = List & { tasks: ListTaskWithTask[] };

let cache: {
  listWithTasks: ListWithTasks | null;
} = {
  listWithTasks: null,
};

const getListWithTasks = async (
  listId: string,
  db: PostgresJsDatabase<typeof schema>,
): Promise<ListWithTasks> => {
  const listWithTasks = await db.query.LIST.findFirst({
    where: eq(LIST.id, listId),
    with: {
      author: true,
      tasks: {
        orderBy: desc(LIST_TASK.orderInList),
        with: {
          task: true,
        },
      },
    },
  }).then(singleOrThrow);
  return listWithTasks;
};

export const listRouter = createTRPCRouter({
  getLists: protectedProcedure
    .input(z.object({}))
    .use((opt) => opt.next())
    .query(async ({ ctx }) => {
      const lists = await ctx.db.query.LIST.findMany({
        where: eq(LIST.authorId, ctx.session.user.id),
        orderBy: desc(LIST.createdAt),
      });
      return lists;
    }),
  getList: protectedProcedure
    .input(z.object({ id: z.string() }))
    .use(
      accessControl(async (option, userAbility) => {
        const listWithTasks = await getListWithTasks(
          option.input.id,
          option.ctx.db,
        );
        cache.listWithTasks = listWithTasks;
        return userAbility.can("read", subject("LIST", listWithTasks));
      }),
    )
    .query(async ({ input, ctx }) => cache.listWithTasks),
  createList: protectedProcedure
    .input(listCreateSchema)
    .use(
      accessControl(async ({ ctx }, userAbility) =>
        userAbility.can("create", subject("LIST", ctx.session.user)),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      const list = await ctx.db
        .insert(LIST)
        .values(input)
        .returning()
        .then(singleOrThrow);
      return list;
    }),

  updateList: protectedProcedure
    .input(listUpdateSchema)
    .use(
      accessControl(async (options, userAbility) => {
        const { id } = options.input;
        const list = await options.ctx.db
          .select()
          .from(LIST)
          .where(eq(LIST.id, id))
          .then(singleOrThrow);
        return userAbility.can("update", subject("LIST", list));
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updatedListWithTasks = await ctx.db.transaction(async (tx) => {
        const _updatedList = await ctx.db
          .update(LIST)
          .set(input)
          .where(eq(LIST.id, input.id))
          .returning()
          .then(singleOrThrow);
        if (!_updatedList) throw new TRPCError({ code: "NOT_FOUND" });
        const listWithTasks = await getListWithTasks(input.id, tx);
        return listWithTasks;
      });
      return updatedListWithTasks;
    }),

  deleteList: protectedProcedure
    .input(listUpdateSchema)
    .use(
      accessControl(async (options, userAbility) => {
        const { id } = options.input;
        const list = await options.ctx.db
          .select()
          .from(LIST)
          .where(eq(LIST.id, id))
          .then(singleOrThrow);
        return userAbility.can("delete", subject("LIST", list));
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const deletedList = await ctx.db.transaction(async (tx) => {
        const deletedListTasks = await tx
          .delete(LIST_TASK)
          .where(eq(LIST_TASK.listId, input.id))
          .returning();
        const _deletedList = await ctx.db
          .delete(LIST)
          .where(eq(LIST.id, input.id))
          .returning()
          .then(singleOrThrow);
        if (!_deletedList) throw new TRPCError({ code: "NOT_FOUND" });
        return _deletedList;
      });
      return deletedList;
    }),

  // addTaskToList
  addTaskToList: protectedProcedure
    .input(listTaskCreateSchema)
    .use(
      accessControl(async ({ ctx, input }, userAbility) => {
        const listId = input.listId;
        const list = await ctx.db
          .select()
          .from(LIST)
          .where(eq(LIST.id, listId))
          .then(singleOrThrow);
        return userAbility.can("add_task_to_list", subject("List", list));
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const listWithTasks = await ctx.db.transaction(async (tx) => {
      const listTask = await ctx.db
        .insert(LIST_TASK)
        .values(input)
        .returning()
        .then(singleOrThrow);
        const _listWithTasks = await getListWithTasks(input.listId, tx);
        return _listWithTasks;
      });
      return listWithTasks;
    }),

  createAndAddATaskToAList: protectedProcedure
    .input(z.object({ listId: z.string().uuid(), task: taskCreateSchema }))
    .use(
      accessControl(async ({ ctx, input }, userAbility) => {
        const listId = input.listId;
        const listWithTasks = await ctx.db.query.LIST.findFirst({
          where: eq(LIST.id, listId),
          with: {
            author: true,
            tasks: {
              with: {
                task: true,
              },
            },
          },
        }).then(singleOrThrow);
        cache.listWithTasks = listWithTasks;
        return (
          userAbility.can("add_task_to_list", subject("List", listWithTasks)) &&
          userAbility.can("create", subject("TASK", input.task))
        );
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const listWithTasks = await ctx.db.transaction(async (tx) => {
        const createdTask = await tx
          .insert(TASK)
          .values(input.task)
          .returning()
          .then(singleOrThrow);
        const cachedListWithTasks = cache.listWithTasks!;
        const maxOrderInList = String(
          1 +
            Math.max(
              ...cachedListWithTasks.tasks.map((listTask) =>
                Number(listTask.orderInList),
              ),
            ),
        );

        await tx
          .insert(LIST_TASK)
          .values({
            listId: input.listId,
            taskId: createdTask.id,
            orderInList: maxOrderInList,
          })
          .returning()
          .then(singleOrThrow);
        const _listWithTasks = await getListWithTasks(input.listId, tx);
        return _listWithTasks;
      });
      return listWithTasks;
    }),

  removeATaskFromList: protectedProcedure
    .input(listTaskCreateSchema)
    .use(
      accessControl(async ({ ctx, input }, userAbility) => {
        const listId = input.listId;
        const list = await ctx.db
          .select()
          .from(LIST)
          .where(eq(LIST.id, listId))
          // .all()
          .then(singleOrThrow);
        return userAbility.can("remove_task_from_list", subject("List", list));
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const listId = input.listId;
      const taskId = input.taskId;
      const listWithTasks = await ctx.db.transaction(async (tx) => {
        await ctx.db
          .delete(LIST_TASK)
          .where(
            and(eq(LIST_TASK.listId, listId), eq(LIST_TASK.taskId, taskId)),
          );
        const _listWithTasks = await getListWithTasks(listId, tx);
        return _listWithTasks;
      });
      return listWithTasks;
    }),
  reorderATask: protectedProcedure
    .input(listTaskUpdateSchema)
    .use(
      accessControl(async ({ ctx, input }, userAbility) => {
        const listId = input.listId;
        const listWithTasks = await getListWithTasks(listId, ctx.db);
        return userAbility.can(
          "reorder_tasks_in_list",
          subject("List", listWithTasks),
        );
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const listWithTasks = await ctx.db.transaction(async (tx) => {
        await tx
          .update(LIST_TASK)
          .set(input)
          .where(
            and(
              eq(LIST_TASK.listId, input.listId),
              eq(LIST_TASK.taskId, input.taskId),
            ),
          )
          .returning()
          .then(singleOrThrow);
        const _listWithTasks = await getListWithTasks(input.listId, tx);
        return _listWithTasks;
      });
      return listWithTasks;
    }),
  // reorderTask
});
