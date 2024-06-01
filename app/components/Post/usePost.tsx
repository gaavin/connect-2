import { useRouteLoaderData } from "@remix-run/react";
import { useNodesState, useReactFlow } from "reactflow";
import type { loader } from "~/routes/_index";

export const useNodes = () => {
  const loaderData = useRouteLoaderData<typeof loader>("routes/_index");
  const reactFlow = useReactFlow();
  const nodes = useNodesState([]);
};
