import pluginVue from 'eslint-plugin-vue'
import {
  defineConfigWithVueTs,
  vueTsConfigs
} from '@vue/eslint-config-typescript'
import prettier from '@vue/eslint-config-prettier'

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue,js,mjs,cjs}']
  },
  {
    name: 'app/files-to-ignore',
    ignores: ['dist/**', 'safari-web-extension/**', 'xcode/**', 'coverage/**']
  },
  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  prettier
)
