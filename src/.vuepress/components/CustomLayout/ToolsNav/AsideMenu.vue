<template>
  <template v-for="menuItem in props.menuList">
    <component
        :is="menuItem.children ? 'el-sub-menu' : 'el-menu-item'"
        :index="menuItem.children ? menuItem.id : ''"
        @click="open(menuItem)"
    >
      <template #title>
          <span>{{ menuItem.name }}</span>
      </template>
      <AsideMenu :menuList="menuItem.children"></AsideMenu>
    </component>
  </template>
</template>
<script lang="ts" setup>
import { getCurrentInstance } from 'vue'
const { $bus } = getCurrentInstance()!.appContext.config.globalProperties
const props = defineProps({
  menuList: Array as any
})

function open(menuItem: any) {
  if (!menuItem.children) {
    window.open(menuItem.path)
  } else {
    $bus.emit('clearInput')
    setTimeout(() => {
      let div = document.getElementById(menuItem.id)
      if (div) {
        div.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }
}
</script>

<style scoped>
::v-deep(.el-sub-menu__title) {
  height: 30px;
}

::v-deep(.el-menu .el-menu-item) {
  height: 30px;
}
</style>
