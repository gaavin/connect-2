import type { Config } from "drizzle-kit";

export default {
  schema: "./app/consts/schema.ts",
  out: "./drizzle",
} satisfies Config;
