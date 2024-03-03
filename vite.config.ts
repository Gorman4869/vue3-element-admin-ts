import { defineConfig, UserConfig, ConfigEnv, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
// https://vitejs.dev/config/
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import UnoCSS from "unocss/vite";

const pathSrc = resolve(__dirname, "src");
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, process.cwd());
  return {
    resolve: {
      alias: {
        "@": pathSrc,
      },
    },
    css: {
      // CSS 预处理器
      preprocessorOptions: {
        // 定义全局 SCSS 变量
        scss: {
          javascriptEnabled: true,
          additionalData: `
            @use "@/styles/variables.scss" as *;
          `,
        },
      },
    },
    server: {
      // 允许IP访问
      host: "0.0.0.0",
      // 应用端口 (默认:3000)
      port: Number(env.VITE_APP_PORT),
      // 运行是否自动打开浏览器
      open: true,
      proxy: {
        /**
         * env.VITE_APP_BASE_API: /dev-api
         */
        [env.VITE_APP_BASE_API]: {
          changeOrigin: true,
          // 接口地址
          target: env.VITE_APP_API_URL,
          rewrite: (path) =>
            path.replace(new RegExp("^" + env.VITE_APP_BASE_API), ""),
        },
      },
    },
    plugins: [
      vue(),
      UnoCSS({
        hmrTopLevelAwait: false,
      }),
      AutoImport({
        resolvers: [
          //自动导入Element Plus相关函数 如：ELMessage
          ElementPlusResolver(),
          //自动导入图标组件
          IconsResolver({}),
        ],
        vueTemplate: true,
        imports: ["vue"],
        eslintrc: {
          enabled: true, //是否自动生成eslint规则，建议生成之后设置false
          filepath: "./.eslintrc-auto-import.json",
        },
        dts: resolve(pathSrc, "types", "auto-imports.d.ts"), //指定自动导入函数TS类型声明文件路径
      }),
      Components({
        resolvers: [
          //自动导入Element Plus组件
          ElementPlusResolver(),
          //自动注册图标组件
          IconsResolver({
            enabledCollections: ["ep"],
          }),
        ],
        // 指定自定义组件位置(默认:src/components)
        dirs: ["src/components", "src/**/components"],
        dts: resolve(pathSrc, "types", "components.d.ts"), //指定自动导入组件TS类型声明文件路径
      }),
      Icons({
        //自动安装图标库
        autoInstall: true,
      }),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [resolve(pathSrc, "assets/icons")],
        // 指定symbolId格式
        symbolId: "icon-[dir]-[name]",
      }),
    ],
  };
});
