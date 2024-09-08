// @ts-ignore
import { defineClientConfig } from "vuepress/client";
import { defineAsyncComponent } from "vue"
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import Navigation from "./components/CustomLayout/Navigation/index.vue"
// @ts-ignore
const FooterRunTime = defineAsyncComponent(() => import("./components/Footer/FooterRunTime.vue"));
import mitt from 'mitt'
import axios from 'axios'
export default defineClientConfig({
  enhance: ({ app }) => {
    app.use(ElementPlus)
    app.config.globalProperties.$bus = mitt()
    app.config.globalProperties.$axios = axios
  },
  // 自定义布局
  layouts: {
    Navigation
  },
  rootComponents:[
    // footer运行时间
    FooterRunTime
  ]
})