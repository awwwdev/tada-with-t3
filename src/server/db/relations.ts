import { relations } from 'drizzle-orm';
import { TASK } from './task.schema';
import { LIST } from './list.schema';
import { USER } from './user.schema';
import { LIST_TASK } from './list-task.schema';
import { FOLDER } from './folder.schema';
import { ACCOUNT } from "./account.schema";
import { SESSION } from "./session.schema";
import { FOLDER_LIST } from "./folder-list.schema";

export const usersRelations = relations(USER, ({ many }) => ({
  accounts: many(ACCOUNT),
}));

export const accountsRelations = relations(ACCOUNT, ({ one }) => ({
  user: one(USER, { fields: [ACCOUNT.userId], references: [USER.id] }),
}));

export const sessionsRelations = relations(SESSION, ({ one }) => ({
  user: one(USER, { fields: [SESSION.userId], references: [USER.id] }),
}));

export const taskRelations = relations(TASK, ({ one, many }) => ({
  author: one(USER, { fields: [TASK.authorId], references: [USER.id] }),
  lists: many(LIST_TASK)
}));

export const listRelations = relations(LIST, ({ one, many }) => ({
  author: one(USER, { fields: [LIST.authorId], references: [USER.id] }),
  tasks: many(LIST_TASK),
  folders: many(FOLDER),
  // folder: one(FOLDER, { fields: [LIST.folderId], references: [FOLDER.id] }),
}));

export const listTaskRelations = relations(LIST_TASK, ({ one }) => ({
  list: one(LIST, { fields: [LIST_TASK.listId], references: [LIST.id] }),
  task: one(TASK, { fields: [LIST_TASK.taskId], references: [TASK.id] }),
}));

export const folderRelations = relations(FOLDER, ({ one, many }) => ({
  author: one(USER, { fields: [FOLDER.authorId], references: [USER.id] }),
  lists: many(LIST),
}));

export const folderListRelation = relations(FOLDER_LIST, ({one}) => ({
  folder: one(FOLDER, {fields: [FOLDER_LIST.folderId], references: [FOLDER.id]}),
  list: one(LIST, {fields: [FOLDER_LIST.listId], references: [LIST.id]}),
}))

