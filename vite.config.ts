import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'path'
import stdLibBrowser from 'node-stdlib-browser'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import inject from '@rollup/plugin-inject'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import vueI18n from '@intlify/vite-plugin-vue-i18n'
import svgLoader from 'vite-svg-loader'
import VitePluginHtmlEnv from 'vite-plugin-html-env'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { viteExternalsPlugin } from 'vite-plugin-externals'
import pkg from './package.json'
const pathSrc = path.resolve(__dirname, 'src')

export default ({ mode, command }) => {
  const env = loadEnv(mode, process.cwd())
  const isProduction = command === 'build'
  return defineConfig({
    base: env.VITE_API_BASE_URL,
    plugins: [
      command === 'serve' &&
      nodePolyfills({
        // To add only specific polyfills, add them here. If no option is passed, adds all polyfills
        include: ['path'],
        // To exclude specific polyfills, add them to this list. Note: if include is provided, this has no effect
        exclude: [
          'http', // Excludes the polyfill for `http` and `node:http`.
        ],
        // Whether to polyfill specific globals.
        globals: {
          Buffer: true, // can also be 'build', 'dev', or false
          global: true,
          process: true,
        },
        // Override the default polyfills for specific modules.
        overrides: {
          // Since `fs` is not supported in browsers, we can use the `memfs` package to polyfill it.
          fs: 'memfs',
        },
        // Whether to polyfill `node:` protocol imports.
        protocolImports: true,
      }),
      {
        ...inject({
          global: [require.resolve('node-stdlib-browser/helpers/esbuild/shim'), 'global'],
          process: [require.resolve('node-stdlib-browser/helpers/esbuild/shim'), 'process'],
          Buffer: [require.resolve('node-stdlib-browser/helpers/esbuild/shim'), 'Buffer'],
        }),
        enforce: 'post',
      },
      vue({
        template: {
          compilerOptions: {
            isCustomElement: tag => tag.includes('show-'),
          },
        },
      }),
      AutoImport({
        resolvers: [
          ElementPlusResolver(),
          IconsResolver({
            prefix: 'Icon',
          }),
        ],
        dts: path.resolve(pathSrc, 'auto-imports.d.ts'),
      }),
      Components({
        resolvers: [
          ElementPlusResolver(),
          IconsResolver({
            enabledCollections: ['ep'],
          }),
        ],
        dts: path.resolve(pathSrc, 'components.d.ts'),
      }),
      Icons({
        autoInstall: true,
      }),
      vueI18n({
        // if you want to use Vue I18n Legacy API, you need to set `compositionOnly: false`
        // compositionOnly: false,

        // you need to set i18n resource including paths !
        include: path.resolve(__dirname, './src/languages/**'),
      }),
      svgLoader(),
      VitePluginHtmlEnv(),
      createSvgIconsPlugin({

        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        symbolId: 'icon-[dir]-[name]',

        customDomId: '__svg__icons__dom__',
      }),
      viteExternalsPlugin({
        // 'mvc-lib': 'mvc',
        // 'mvc-lib/ecies': 'ECIES',
        // 'mvc-lib/mnemonic': 'Mnemonic',
        // bip39: 'bip39',
      }),

      // basicSsl(),
    ],
    resolve: {
      alias: {
        '@': '/src',
        ...stdLibBrowser,
      },
    },
    // css: {
    //   preprocessorOptions: {
    //     scss: {
    //       addtionalData: '@import "./src/assets/styles/var.scss"',
    //     },
    //   },
    // },
    optimizeDeps: {
      include: ['buffer', 'process'],
    },
    define: {
      _APP_VERSION: JSON.stringify(pkg.version),
    },
    server: {
      host: true,
    },
    esbuild: {
      drop: isProduction ? ['console', 'debugger'] : [],
    },
    build: {
      target: isProduction ? 'es2015' : 'modules',
      minify: isProduction,
      sourcemap: isProduction ? false : 'inline',
      // sourcemap: true,
      // rollupOptions: {
      //   // @ts-ignore
      //   plugins: [nodePolyfills()],
      //   output: {
      //     sourcemap: isProduction ? false : 'inline',
      //   },
      // },
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
    sourcemap: isProduction ? false : 'inline',
  })
}
