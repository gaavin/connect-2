import type { Config } from "drizzle-kit";

export default {
  dialect: "sqlite",
  dbCredentials: {
    url: "./drizzle.db",
  },
  schema: "./app/lib/drizzle/schema.ts",
  out: "./app/lib/drizzle",
} satisfies Config;
