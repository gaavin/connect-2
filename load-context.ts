import { type PlatformProxy } from "wrangler";

export type Cloudflare = Omit<PlatformProxy<Env>, "dispose">;
declare module "@remix-run/cloudflare" {
  interface AppLoadContext {
    cloudflare: Cloudflare;
  }
}

// no need to touch this file, use ~/app/lib/loadContext.ts instead
