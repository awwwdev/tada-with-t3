import { createInsertSchema } from 'drizzle-zod';

import { decimal, pgTable, uuid, timestamp, primaryKey, pgEnum, unique } from 'drizzle-orm/pg-core';
import { z } from 'zod';
import { LIST } from './list.schema';
import { FOLDER } from "./folder.schema";

export const FOLDER_LIST = pgTable('folder_list', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
  folderId: uuid('folder_id')
    .references(() => FOLDER.id)
    .notNull(),
  listId: uuid('list_id')
    .references(() => LIST.id).notNull(),
  orderInFolder: decimal('order_in_folder').default('1').notNull(),
},
  (table) => ([
    unique('Each task can be repeated once in a list').on(table.folderId, table.listId),
    // check1: check("userListId or smartListId must be set", sql`num_nonnulls(${table.smartListId},${table.listId}) = 1`),
  ])
);

export const folderListCreateSchema = createInsertSchema(FOLDER_LIST, {
  orderInFolder: z.string().refine(
    (v) => {
      let n = Number(v);
      return !isNaN(n) && v?.length > 0;
    },
    { message: 'Invalid number' }
  ),
})
  .omit({ id: true, createdAt: true, updatedAt: true })
  .strict();
export const folderListUpdateSchema = folderListCreateSchema.partial().merge(z.object({ listId: z.string().uuid(), folderId: z.string().uuid() }));

export type FolderList = typeof FOLDER_LIST.$inferSelect;
export type NewFolderList = z.infer<typeof folderListCreateSchema>;
export type UpdateFolderList = z.infer<typeof folderListUpdateSchema>;
