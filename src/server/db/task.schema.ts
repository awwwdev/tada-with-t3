import { createInsertSchema } from 'drizzle-zod';

import { sql } from "drizzle-orm";
import { AnyPgColumn, boolean, integer, json, pgEnum, pgPolicy, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { z } from 'zod';
import { supabaseRoles } from "./roles";
import { USER } from './user.schema';

export const TaskStatusEnum = pgEnum('task_status', ['to-do', 'done']);

export const TASK = pgTable('task', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
  label: text('label').notNull(),
  emojis: text('emojis').array(),
  authorId: uuid('author_id').references(() => USER.id),
  note: json('note'),
  status: TaskStatusEnum('task_status').default('to-do'), // TODO enum
  dueAt: timestamp('due_at'),
  deleted: boolean('deleted').default(false),
  starred: boolean('starred').default(false),
  pinned: boolean('pinned').default(false),
  archived: boolean('archived').default(false),
  stepOf: uuid('step_of').references((): AnyPgColumn => TASK.id),
  stepIndex: integer('step_index'),
  // listId: uuid('list_id').references(() => LIST.id),
  // orderInList: decimal('order_in_list').default("0"),
}, (t) => [
  pgPolicy('owner-has-full-access', {
    as: 'permissive',
    to: supabaseRoles.authenticatedRole,
    for: "all",
    using: sql`(select auth.uid()) = author_id`,
    // withCheck: sql`TRUE`,
  }),
]);


const refinements = {
  emojis: z.array(z.string()).optional(),
  authorId: z.string().uuid(),
  // listId: z.string().uuid(),
}

export const taskCreateSchema = createInsertSchema(TASK, refinements).omit({ id: true, createdAt: true, updatedAt: true }).strict();
export const taskUpdateSchema = taskCreateSchema.partial().merge(z.object({id: z.string().uuid(), authorId: z.string().uuid()}));

export type Task = typeof TASK.$inferSelect;
export type NewTask = z.infer<typeof taskCreateSchema>;
export type UpdateTask = z.infer<typeof taskUpdateSchema>;