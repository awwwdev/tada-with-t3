import { type Config } from "drizzle-kit";

import { env } from "~/env";

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  entities: {
		roles: {
			provider: "supabase",
		},
	},

  // tablesFilter: ["T3-Stack-Example_*"],
} satisfies Config;
