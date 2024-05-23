import { AppLoadContext } from "@remix-run/cloudflare";
import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";
import { DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import { emitEvent } from "./events.server";
import { z } from "zod";
import * as build from "@remix-run/dev/server-build";

export const onRequest = createPagesFunctionHandler({
  build,
  getLoadContext: async (_context) => {
    const context = await ContextSchema.parseAsync(_context);
    emitEvent("onLoadContextReady", context);
    return context;
  },
});

declare module "@remix-run/cloudflare" {
  interface AppLoadContext {
    context: { db: DrizzleD1Database };
  }
}

const ContextSchema = z.custom<AppLoadContext>().transform(async (_context) => {
  const context = {
    ...Object(_context),
    context: {
      db: drizzle(_context.cloudflare.env.DB_PRODUCTION),
    },
  } as AppLoadContext;
  return context;
});
