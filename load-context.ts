import { type PlatformProxy } from "wrangler";
import { injectDependencies } from "~/lib/loadContext.server";

export type Cloudflare = Omit<PlatformProxy<Env>, "dispose">;

export type GetLoadContextArgs = {
  request: Request;
  context: { cloudflare: Cloudflare };
};

export function getLoadContext({ request, context }: GetLoadContextArgs) {
  return {
    ...context,
    ...injectDependencies({ request, context }),
  };
}

declare module "@remix-run/cloudflare" {
  interface AppLoadContext extends ReturnType<typeof getLoadContext> {}
}
