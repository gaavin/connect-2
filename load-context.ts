import { AppLoadContext } from "@remix-run/cloudflare";
import { DrizzleD1Database, drizzle } from "drizzle-orm/d1/driver";
import { type PlatformProxy } from "wrangler";
import { emitEvent } from "~/lib/events.server";

export const setLoadContext = (context: AppLoadContext) => {
  const db = drizzle(context.cloudflare.env.DB_PRODUCTION);
  context.db = db;
  emitEvent("onLoadContextReady", context);
};

export type Cloudflare = Omit<PlatformProxy<Env>, "dispose">;
declare module "@remix-run/cloudflare" {
  interface AppLoadContext {
    cloudflare: Cloudflare;
    db: DrizzleD1Database;
  }
}
