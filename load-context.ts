import type { PlatformProxy } from "wrangler";
import { create } from "zustand";
import { Dependants } from "~/lib/context.server";

export type QuirkedUpContext = Omit<PlatformProxy<Env>, "dispose"> & Dependants;
export const useContext = create(() => ({} as QuirkedUpContext));

declare module "@remix-run/cloudflare" {
  interface AppLoadContext extends QuirkedUpContext {}
}
