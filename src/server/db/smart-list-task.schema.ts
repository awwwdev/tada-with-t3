import { createInsertSchema } from 'drizzle-zod';

import { decimal, pgEnum, pgTable, timestamp, unique, uuid } from 'drizzle-orm/pg-core';
import { z } from 'zod';
import { TASK } from './task.schema';

export const SMART_LIST_IDS = {
  ALL_TASKS: 'all-tasks',
  // DO_TODAY: "DO_TODAY",
  // DO_TOMORROW: "DO_TOMORROW",
  // DO_LATER: "DO_LATER",
  // NEXT_WEEK: "NEXT_WEEK",
  // ASSIGNED: "ASSIGNED",
  // ASSIGNED_TO_ME: "ASSIGNED_TO_ME",
  // WITH_REMINDERS: "WITH_REMINDERS",
  // ROUTINES: "ROUTINES",
  ARCHIVED: "archived",
  DELETED: "deleted",
  STARRED: "starred",
  PINNED: "pinned",
  // WITH_DUE_DATES: "WITH_DUE_DATES",
} as const satisfies Record<string, string>;

const SMART_LIST_IDS_ARRAY = Object.values(SMART_LIST_IDS);

export const SmartListIdEnum = pgEnum('smart_list_id', SMART_LIST_IDS_ARRAY as [string, ...string[]]);

export const SMART_LIST_TASK = pgTable('smart_list_task', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
  smartListId: SmartListIdEnum('smart_list_id'),
  taskId: uuid('task_id')
    .references(() => TASK.id)
    .notNull(),
  orderInList: decimal('order_in_list').default('1').notNull(),
}, (table) => ({
  unq: unique('Each task can be repeated once in a smart list').on(table.smartListId, table.taskId)
}));

export const smartListTaskCreateSchema = createInsertSchema(SMART_LIST_TASK, {
  orderInList: z.string().refine(
    (v) => {
      let n = Number(v);
      return !isNaN(n) && v?.length > 0;
    },
    { message: 'Invalid number' }
  ),
})
  .omit({ id: true, createdAt: true, updatedAt: true })
  .strict();
export const smartListTaskUpdateSchema = smartListTaskCreateSchema.omit({
  smartListId: true,
  taskId: true,
}).partial();

export type SmartListTask = typeof SMART_LIST_TASK.$inferSelect;
export type NewSmartListTask = z.infer<typeof smartListTaskCreateSchema>;
export type UpdateSmartListTask = z.infer<typeof smartListTaskUpdateSchema>;


//TOTO condition that smart list id and taskId combination is unique