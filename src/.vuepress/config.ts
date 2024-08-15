import { defineUserConfig } from "vuepress";
import theme from "./theme.js";
import { componentsPlugin } from "vuepress-plugin-components";
export default defineUserConfig({
  base: "/",
  dest:"./dev-ops/nginx/html",  // 打包目录
  lang: "zh-CN",
  title: "一条咸鱼的博客",
  theme,
  plugins:[
    componentsPlugin({
      components:["VPBanner","VPCard"]
    }),
  ]
});
