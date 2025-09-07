import { fileURLToPath, URL } from "node:url";

import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import webExtension from "@samrum/vite-plugin-web-extension";
import { writeFileSync, readFileSync } from "node:fs";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const pkg = require("./package.json");
  const isSafari = env.VITE_BROWSER_TYPE === "safari";

  return {
    plugins: [
      vue(),
      webExtension({
        manifest: {
          name: capitalize(pkg.name),
          description: pkg.description,
          version: pkg.version,
          manifest_version: 2,
          author: "Jakub Filo",
          icons: {
            "128": "icon.png",
          },
          background: {
            scripts: isSafari
              ? ["src/background-safari.ts"]
              : ["src/background-firefox.ts"],
            persistent: isSafari ? false : true,
          },
          browser_action: {
            default_title: capitalize(pkg.name),
          },
          options_ui: {
            page: "index.html",
            open_in_tab: true,
          },
          ...(isSafari ? { chrome_url_overrides: { newtab: "new_tab_page.html" } } : {}),
          permissions: isSafari
            ? [
                "storage",
                "declarativeNetRequest",
                "declarativeNetRequestWithHostAccess",
                "<all_urls>",
                "webNavigation",
              ]
            : [
                "storage",
                "webRequest",
                "webRequestBlocking",
                "browserSettings",
                "webNavigation",
              ],
          optional_permissions: ["*://*/*"]
        },
      }),
      {
        // vite-plugin-web-extension does not support browser_url_overrides
        name: 'post-build',
        closeBundle: () => {
          if (isSafari) {
            const manifestPath = 'dist/manifest.json';
            const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
            manifest.browser_url_overrides = manifest.chrome_url_overrides;
            delete manifest.chrome_url_overrides;
            writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

            const htmlPath = 'dist/new_tab_page.html';
            let html = readFileSync(htmlPath, 'utf8');
            html = html.replace(
              'VITE_NEW_PAGE_URL',
              `${env.VITE_NEW_PAGE_URL}`
            );
            writeFileSync(htmlPath, html);
          }
        }
      }
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  };
});

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
