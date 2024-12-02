import { createInsertSchema } from "drizzle-zod";

import {
  decimal,
  pgTable,
  uuid,
  timestamp,
  primaryKey,
  pgEnum,
  unique,
  check,
} from "drizzle-orm/pg-core";
import { z } from "zod";
import { TASK } from "./task.schema";
import { LIST } from "./list.schema";

export const LIST_TASK = pgTable(
  "list_task",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
    listId: uuid("list_id")
      .references(() => LIST.id)
      .notNull(),
    taskId: uuid("task_id")
      .references(() => TASK.id)
      .notNull(),
    orderInList: decimal("order_in_list").default("1").notNull(),
  },
  (table) => [
    unique("Each task can be repeated once in a list").on(
      table.listId,
      table.taskId,
    ),
    // check1: check("userListId or smartListId must be set", sql`num_nonnulls(${table.smartListId},${table.listId}) = 1`),
  ],
);

export const listTaskCreateSchema = createInsertSchema(LIST_TASK, {
  orderInList: z.string().refine(
    (v) => {
      let n = Number(v);
      return !isNaN(n) && v?.length > 0;
    },
    { message: "Invalid number" },
  ),
})
  .omit({ id: true, createdAt: true, updatedAt: true })
  .strict();
export const listTaskUpdateSchema = listTaskCreateSchema
  .partial()
  .merge(z.object({ listId: z.string().uuid(), taskId: z.string().uuid() }));

export type ListTask = typeof LIST_TASK.$inferSelect;
export type NewListTask = z.infer<typeof listTaskCreateSchema>;
export type UpdateListTask = z.infer<typeof listTaskUpdateSchema>;
