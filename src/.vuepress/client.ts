// @ts-ignore
import { defineClientConfig } from "vuepress/client";
import { defineAsyncComponent } from "vue"
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import ToolsNavLayout from "./components/CustomLayout/ToolsNav/index.vue"
// @ts-ignore
const FooterRunTime = defineAsyncComponent(() => import("./components/Footer/FooterRunTime.vue"));
import mitt from 'mitt'
import axios from 'axios'
export default defineClientConfig({
  enhance: ({ app, router, siteData }) => {
    app.use(ElementPlus)
    app.config.globalProperties.$bus = mitt()
    app.config.globalProperties.$axios = axios
  },
  // 自定义布局
  layouts: {
    ToolsNavLayout
  },
  rootComponents:[
    // footer运行时间
    FooterRunTime
  ]
})