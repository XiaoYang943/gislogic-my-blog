// @ts-ignore
import { defineClientConfig } from "vuepress/client";
import { defineAsyncComponent } from "vue"
// import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'
// import CustomDemoLayout from "./components/CustomLayout/CustomDemoLayout.vue"

// @ts-ignore
const FooterRunTime = defineAsyncComponent(() => import("./components/Footer/FooterRunTime.vue"));

export default defineClientConfig({
  enhance: ({ app, router, siteData }) => {
    // app.use(ElementPlus)
  },
  // 自定义布局
  layouts: {
    // CustomDemoLayout
  },
  rootComponents:[
    // footer运行时间
    FooterRunTime
  ]
})