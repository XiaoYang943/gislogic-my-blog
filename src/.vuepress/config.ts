import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "一条咸鱼的博客",
  // description: "vuepress-theme-hope 的博客演示",

  theme,

  // 和 PWA 一起启用
  // shouldPrefetch: false,
});

/**
 * Spring Vue.js JAVA JavaScript Docker Mybatis MySQL Nginx Redis PostgreSQL HTTP
 */

