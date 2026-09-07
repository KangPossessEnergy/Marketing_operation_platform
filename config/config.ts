//webpakc的配置(非运行时配置)
import { defineConfig } from "umi";

import { routes } from "./routes";

export default defineConfig({
  /*   基础配置   */

  //1 配置别名,umi已经配好@了,默认是src目录下
  alias: {
    // foo: require.resolve('foo'),
  },

  //2 配置sourcemap
  //关闭sourcemap文件生成,无法定位到源码
  // devtool: false,
  //开发环境使用关闭sourcemap文件生成,生产环境不使用
  devtool: process.env.NODE_ENV === "development" ? "eval" : false,

  //3 开启hash模式   打包后的产物会带上hash值
  hash: true,

  //4 Base64
  //配置图片的打包方式,大于10kb,单独打包成一个图片,如果小于10kb,打包成Base64
  inlineLimit: 10000,

  //5 配置js的压缩方式
  //开启多线程
  jsMinifier: "esbuild",

  //6 tree shaking
  jsMinifierOptions: {
    minifyWhitespace: true, // 删除无用空白
    minifyIdentifiers: true, // 缩短标识符
    minifySyntax: true, // 简化语法结构
  },
  esbuildMinifyIIFE: true,

  //8 配置打包后资源的导入路径, 默认是/   开发环境不用配,生产环境也就是项目部署的时候需要配
  publicPath: process.env.NODE_ENV === "development" ? "/" : "/abc/",
  proxy: {
    "/api": {
      target: "http://127.0.0.1:3000",
      changeOrigin: true,
      pathRewrite: { "^/api": "" },
    },
    "/agent-api": {
      target: process.env.AGENT_SERVER_URL || "http://127.0.0.1:3001",
      changeOrigin: true,
      pathRewrite: { "^/agent-api": "/api" },
      // 保证代理不对 SSE 进行压缩与缓冲
      headers: {
        "Accept-Encoding": "identity", // 避免 gzip 压缩导致的缓冲区积攒
      },
    },
  },
  //9 配置网站标题
  title: "营销运营平台",

  // 配置路由
  routes,
  conventionRoutes: {
    exclude: [/\/components\//], // 排除自动生成路由的目录
  },
  //使用的包管理器是
  npmClient: "pnpm",
});
