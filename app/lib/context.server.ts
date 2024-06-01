import { AppLoadContext, EntryContext } from "@remix-run/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { create } from "zustand";
import { emitEvent } from "~/lib/events.server";
import { diff } from "~/lib/utils";

export const dependencies = {
  dbProduction: (context: EventContext<Env, any, any>) =>
    drizzle(context.env.DB_PRODUCTION),
  dbDevelopment: (context: EventContext<Env, any, any>) =>
    drizzle(context.env.DB_DEVELOPMENT),
  kvProduction: (context: EventContext<Env, any, any>) =>
    context.env.KV_PRODUCTION,
  kvDevelopment: (context: EventContext<Env, any, any>) =>
    context.env.KV_DEVELOPMENT,
} satisfies Record<string, Function>;

type InferDependencies<T> = {
  [K in keyof T]: T[K] extends (context: EventContext<Env, any, any>) => infer R
    ? R
    : never;
};

export type Dependants = InferDependencies<typeof dependencies>;

export type QuirkedUpContext = AppLoadContext & Dependants;

export const useContext = create(() => ({} as QuirkedUpContext));
export const getContext = () => useContext.getState();

export function injectDependencies<TContext>(
  ctx: TContext extends EventContext<Env, any, any> ? TContext : never
) {
  const deps: Partial<QuirkedUpContext> = {};
  Object.entries(dependencies).forEach(([key, dependency]) => {
    deps[key] = dependency(ctx);
  });

  useContext.subscribe((state, prevState) => {
    emitEvent("onContextChange", diff(state, prevState));
  });
  return deps;
}

declare module "@remix-run/cloudflare" {
  interface AppLoadContext extends Dependants {}
}
