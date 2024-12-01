export { FOLDER } from "./folder.schema";
export { LIST } from "./list.schema";
export { LIST_TASK } from "./list-task.schema";
export { SMART_LIST_TASK, SmartListIdEnum } from "./smart-list-task.schema";
export { TASK, TaskStatusEnum } from "./task.schema";
export { USER, USER_VIEW } from "./user.schema";
export { SESSION } from "./session.schema";
export { ACCOUNT } from "./account.schema";
export { VERIFICATION_TOKEN } from "./verification-token.schema";
export * as relations from "./relations";
/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
// export const createTable = pgTableCreator((name) => `T3-Stack-Example_${name}`);

// export const posts = createTable(
//   "post",
//   {
//     id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
//     name: varchar("name", { length: 256 }),
//     createdById: varchar("created_by", { length: 255 })
//       .notNull()
//       .references(() => users.id),
//     createdAt: timestamp("created_at", { withTimezone: true })
//       .default(sql`CURRENT_TIMESTAMP`)
//       .notNull(),
//     updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
//       () => new Date()
//     ),
//   },
//   (example) => ({
//     createdByIdIdx: index("created_by_idx").on(example.createdById),
//     nameIndex: index("name_idx").on(example.name),
//   })
// );
