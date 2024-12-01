import { sql } from "drizzle-orm";
import { bigserial, pgSchema, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

// drizzle-orm/supabase
const auth = pgSchema('auth');
export const AUTH_USER = auth.table('users', {
	id: uuid("id").primaryKey().notNull(),
  email: varchar("email", {length: 255}),
	phone: text("phone"),
	email_confirmed_at: timestamp("email-confirmed-at")
});

const realtime = pgSchema('realtime');
export const REALTIME_MESSAGES = realtime.table(
	'messages',
	{
		id: bigserial("id", { mode: 'bigint' }).primaryKey(),
		topic: text("topic").notNull(),
		extension: text("extensions", {
			enum: ['presence', 'broadcast', 'postgres_changes'],
		}).notNull(),
	},
);
export const authUid = sql`(select auth.uid())`;
export const realtimeTopic = sql`realtime.topic()`;