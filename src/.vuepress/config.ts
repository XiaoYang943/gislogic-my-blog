import { defineUserConfig } from "vuepress";
import theme from "./theme.js";
import { componentsPlugin } from "vuepress-plugin-components";
export default defineUserConfig({
  base: "/",
  dest:"./dev-ops/nginx/html",  // 打包目录
  lang: "zh-CN",
  title: "一条咸鱼的博客",
  // description: "vuepress-theme-hope 的博客演示",

  theme,

  // 和 PWA 一起启用
  // shouldPrefetch: false,
  plugins:[
    componentsPlugin({
      components:["VPBanner","VPCard"]
    }),
  ]
});

/**
 * Spring Vue.js JAVA JavaScript Docker Mybatis MySQL Nginx Redis PostgreSQL HTTP
 */

