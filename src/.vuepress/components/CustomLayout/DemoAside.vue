<template>
  <el-aside>
    <!-- v-if 异步渲染menu -->
    <el-menu
      active-text-color="#2cc0da"
      class="sidebar_container"
      style="height: 100%"
      unique-opened
    >
      <el-scrollbar max-height="800px">
        <DemoAsideMenu :menuList="props.menuList"></DemoAsideMenu>
      </el-scrollbar>
    </el-menu>
  </el-aside>
</template>

<script lang="ts" setup>
import DemoAsideMenu from './DemoAsideMenu.vue'
// import { useRouter } from 'vue-router'
//
// const router = useRouter()
//
// function handleSelect(item: any) {
//   router.push(item.path)
// }

const props = defineProps({
  menuList: [] as any
})
</script>

<style lang="less" scoped>
.view-lines.monaco-mouse-cursor-text {
  width: 0;
}

.sidebar_container {
  max-height: 100vh;
  overflow-y: auto;
}

::-webkit-scrollbar {
  width: 5px;
  height: 1px;
}

::-webkit-scrollbar-track-piece {
  background-color: rgba(0, 0, 0, 0.2);
  -webkit-border-radius: 6px;
}

::-webkit-scrollbar-thumb:vertical {
  height: 5px;
  background-color: rgba(125, 125, 125, 0.7);
  -webkit-border-radius: 6px;
}

::-webkit-scrollbar-thumb:horizontal {
  width: 5px;
  background-color: rgba(125, 125, 125, 0.7);
  -webkit-border-radius: 6px;
}

.el-submenu.is-opened > .el-submenu__title {
  color: red;
}
</style>
