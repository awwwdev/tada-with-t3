// import { HydratedDocument, InferRawDocType, Schema, model } from 'mongoose';

import { sql } from "drizzle-orm";
import {
  boolean,
  decimal,
  pgPolicy,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { supabaseRoles } from "./roles";
import { USER } from "./user.schema";

export const FOLDER = pgTable(
  "folder",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
    name: text("name").notNull(),
    emojis: text("emojis").array(),
    authorId: uuid("author_id").references(() => USER.id),
    show: boolean("show"),
    orderInPanel: decimal("order_in_panel").default("0"),
  },
  (t) => ([
     pgPolicy("owner-has-full-access", {
      as: "permissive",
      to: supabaseRoles.authenticatedRole,
      for: "all",
      using: sql`(select auth.uid()) = author_id`,
      // withCheck: sql`TRUE`,
    })
  ]),
);

const refinements = {
  emojis: z.array(z.string()).optional(),
  authorId: z.string().uuid(),
};

export const folderCreateSchema = createInsertSchema(FOLDER, refinements).omit({ id: true, createdAt: true, updatedAt: true }).strict();
export const folderUpdateSchema = folderCreateSchema.partial().merge(z.object({ id: z.string().uuid(), authorId: z.string().uuid() }));

export type Folder = typeof FOLDER.$inferSelect;
export type NewFolder = z.infer<typeof folderCreateSchema>;
export type UpdateFolder = z.infer<typeof folderUpdateSchema>;
