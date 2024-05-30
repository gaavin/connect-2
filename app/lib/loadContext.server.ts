import { drizzle } from "drizzle-orm/d1";
import { GetLoadContextArgs } from "load-context";

const dependencies = {
  dbProduction: ({ context }: GetLoadContextArgs) =>
    drizzle(context.cloudflare.env.DB_PRODUCTION),
  dbDevelopment: ({ context }: GetLoadContextArgs) =>
    drizzle(context.cloudflare.env.DB_DEVELOPMENT),
  kvProduction: ({ context }: GetLoadContextArgs) =>
    context.cloudflare.env.KV_PRODUCTION,
  kvDevelopment: ({ context }: GetLoadContextArgs) =>
    context.cloudflare.env.KV_DEVELOPMENT,
} as const satisfies Record<string, Function>;

export function injectDependencies({ request, context }: GetLoadContextArgs) {
  const injectedContext: Record<string, any> = { ...context };

  for (const key in dependencies) {
    if (Object.prototype.hasOwnProperty.call(dependencies, key)) {
      const dependency = dependencies[key as keyof typeof dependencies];
      injectedContext[key] = dependency({ request, context });
    }
  }

  return injectedContext;
}
