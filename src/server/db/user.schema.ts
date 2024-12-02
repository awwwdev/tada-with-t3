import { createInsertSchema } from "drizzle-zod";

import { eq, InferModelFromColumns, InferSelectModel, sql } from "drizzle-orm";
import { customType, foreignKey, json, pgTable, pgView, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { z } from "zod";
import { AUTH_USER } from "./supabase-table.schema";
// import * as x from 'drizzle-orm/

const bytea = customType<{ data: Buffer; notNull: false; default: false }>({
  dataType() {
    return "bytea";
  },
});

type Settings = {
  showCompletedTasks?: boolean;
  theme?: "light" | "dark" | "system";
  startOfWeek?: "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday";
};

export const USER = pgTable(
  "user",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
    // username: text('username').unique(),
    authUserId: uuid("auth_user_id").notNull(),
    name: varchar("name", { length: 255 }),
    email: varchar("email", { length: 255 }).notNull(),
    emailVerified: timestamp("email_verified", {
      mode: "date",
      withTimezone: true,
    }).default(sql`CURRENT_TIMESTAMP`),
    image: varchar("image", { length: 255 }),

    firstname: text("firstname"),
    lastname: text("lastname"),
    // fullname: text("fullname").generatedAlwaysAs((): SQL => sql`${USER.firstname} ${USER.lastname}`),
    settings: json("settings")
      .$type<Settings>()
      .default({ theme: "system", showCompletedTasks: true, startOfWeek: "sunday" }),
  }, (table) => ([
    foreignKey({
      columns: [table.id],
      // reference to the auth table from Supabase
      foreignColumns: [AUTH_USER.id],
      name: "profiles_id_fk",
    })
      .onDelete("cascade")
      .onUpdate("cascade")
  ])
);

export const USER_VIEW = pgView("user_view").as((qb) => qb.select({
  email: AUTH_USER.email,
  phone: AUTH_USER.phone,
  settings: USER.settings,
  firstName: USER.firstname,
  lastname: USER.lastname,
  emailConfirmedAt: AUTH_USER.email_confirmed_at,
  // fullname: USER.fullname,
  id: AUTH_USER.id,
  authUserId: AUTH_USER.id,
}).from(USER).leftJoin(AUTH_USER, eq(USER.authUserId, AUTH_USER.id)));

// export type UserInsert = typeof USER.$inferInsert;

const settingsSchema = z.object({
  theme: z.enum(["light", "dark", "system"]).default("system").optional(),
  showCompletedTasks: z.boolean().default(true).optional(),
  startOfWeek: z
    .enum(["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"])
    .default("sunday")
    .optional(),
});

export const userCreateSchema = createInsertSchema(USER, {
  // email: z.string().email("Please provide a valid email."),
  // username: z
  //   .string()
  //   .min(3, 'Username must be at least 3 characters long.')
  //   .max(25, 'Username must be at most 25 characters long.'),
  settings: settingsSchema,
})
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    // salt: true,
    // passwordHash: true,
  })
  .strict();

export const userUpdateSchema = userCreateSchema.partial();

export type User = typeof USER.$inferSelect;
export type NewUser = z.infer<typeof userCreateSchema>;
export type UpdateUser = z.infer<typeof userUpdateSchema>;


export type UserView = InferModelFromColumns<typeof USER_VIEW['_']['selectedFields']> & { id: string };