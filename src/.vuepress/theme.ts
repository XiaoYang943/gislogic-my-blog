import { hopeTheme } from "vuepress-theme-hope";
import navbar from "./navbar.js";
import sidebar from "./sidebar.js";
export default hopeTheme({
  hostname: "http://gislogic.cn",
  hotReload:true, // 热更新
  author: {
    name: "今儿有劲儿了",
    url: "http://gislogic.cn",
  },
  pageInfo:[  // 页面信息
      "Category",
      "Tag",
      "Word",
      "ReadingTime",
  ],
  repoDisplay:true, // 导航栏内显示仓库链接
  repo: "XiaoYang943/gislogic-my-blog",  // 仓库链接
  repoLabel: "GitHub",  // 仓库链接图标
  iconAssets: "fontawesome-with-brands",

  docsDir: "src",

  navbar,

  sidebar,

  // 页脚
  displayFooter: true,

  blog: {
    description: "一条咸鱼GISer",
    intro: "/intro.html", // 个人介绍
    medias: {
      BiliBili: "https://space.bilibili.com/398528203/",
      Email: "mailto:1352253543@qq.com",
      GitHub: "https://github.com/XiaoYang943",
      Steam: "https://steamcommunity.com/profiles/76561198853138344",
      Zhihu: "https://www.zhihu.com/people/1352253543",
    },
  },
  lastUpdated: true, // 最后更新时间
  editLink: true,  // 编辑链接
  contributors: false,  // 贡献者
  plugins: {
    blog: true, // 开启博客功能
    searchPro: true,  // 搜索框
    components: {
      components: ["Badge", "VPCard"],
    },
    mdEnhance: {
      align: true,  // 文本块内容对齐
      attrs: true,  // 自定义属性
      codetabs: true, // 代码组
      component: true,  // 组件支持
      demo: true, // 代码案例
      imgLazyload: true,  // 原生方式懒加载页面图片
      imgSize: true,  // 图片尺寸
      include: true,  // Markdown 导入
      mark: true, // 标记 .eg: 空格==高亮显示==空格
      sub: true,  // 下角标 .eg ~下角标~
      sup: true,  // 上角标 .eg ^上角标^
      tabs: true, // 选项卡
      katex: true,  // TEX语法
      mermaid: true,  // Mermaid 图表
    },
  },
},{
  custom: true    // 支持自定义Layout
});
