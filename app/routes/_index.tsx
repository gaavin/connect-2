import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { defer, json, useLoaderData } from "@remix-run/react";
import debugFactory from "debug";
import { useContext } from "~/lib/context.server";
import { onEvent } from "~/lib/events.server";

const debug = debugFactory("app:routes:_index");

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    {
      name: "description",
      content: "Welcome to Remix! Using Vite and Cloudflare!",
    },
  ];
};

export async function loader({ context }: LoaderFunctionArgs) {
  console.log("loader context", context);
  useContext.setState({ ...context, dbProduction: null });
  console.log("AAAA", context);
  console.log("BBBB", useContext.getState());
  const p = onEvent("onContextChange", (diff) => {
    console.log("onContextChange", diff);
  });
  return defer({ p });
}

export default async function Index() {
  const loaderData = useLoaderData<typeof loader>();
  console.log(await loaderData.p);

  debug("browser context", loaderData);
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix (with Vite and Cloudflare)</h1>
      <ul>
        <li>
          <a
            target="_blank"
            href="https://developers.cloudflare.com/pages/framework-guides/deploy-a-remix-site/"
            rel="noreferrer"
          >
            Cloudflare Pages Docs - Remix guide
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
      </ul>
    </div>
  );
}
