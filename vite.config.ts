import {
  vitePlugin as remix,
  cloudflareDevProxyVitePlugin as remixCloudflareDevProxy,
} from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import babel from "vite-plugin-babel";

const ReactCompilerConfig = {};

export default defineConfig({
  plugins: [remixCloudflareDevProxy(), remix(), babel({
    filter: /\.[jt]sx?$/,
    babelConfig: {
      presets: ["@babel/preset-typescript"],
      plugins: [
        ["babel-plugin-react-compiler", ReactCompilerConfig],
      ],
    },
  }),, tsconfigPaths()],
});
