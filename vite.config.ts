import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import webExtension from '@samrum/vite-plugin-web-extension'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const pkg = require('./package.json')
  const isSafari = env.VITE_BROWSER_TYPE === 'safari'

  return {
    plugins: [
      vue(),
      webExtension({
        manifest: {
          name: capitalize(pkg.name),
          description: pkg.description,
          version: pkg.version,
          manifest_version: 2,
          author: 'Jakub Filo',
          icons: {
            '128': 'icon.png'
          },
          background: {
            scripts: isSafari
              ? ['src/background-safari.ts']
              : ['src/background-firefox.ts'],
            persistent: isSafari ? false : true
          },
          browser_action: {
            default_title: capitalize(pkg.name)
          },
          options_ui: {
            page: 'index.html',
            open_in_tab: true
          },
          permissions: isSafari
            ? ['storage', 'declarativeNetRequest', '<all_urls>']
            : ['storage', 'webRequest', 'webRequestBlocking'],
          optional_permissions: ['*://*/*']
        }
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  }
})

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
