<template>
  <template v-for="menuItem in props.menuList">
    <template v-if="menuItem.children ? true : menuItem.isShow">
      <component
        :is="menuItem.children ? 'el-sub-menu' : 'el-menu-item'"
        :key="menuItem.name"
        :index="menuItem.children ? menuItem.id : ''"
        @click="open(menuItem)"
      >
        <template #title>
          <span>{{
            menuItem.children ? menuItem.name : menuItem.name.split('-')[1]
          }}</span>
        </template>
        <DemoAsideMenu :menuList="menuItem.children"></DemoAsideMenu>
      </component>
    </template>
  </template>
</template>
<script lang="ts" setup>
import { getCurrentInstance } from 'vue'
// import { useRouter } from 'vue-router'

const { $bus } = getCurrentInstance()!.appContext.config.globalProperties
// const router = useRouter()
const props = defineProps({
  menuList: Array as any
})

function open(menuItem: any) {
  if (!menuItem.children) {
    // router.push(menuItem.path)
  } else {
    $bus.emit('clearInput')
    setTimeout(() => {
      let div = document.getElementById(menuItem.id)
      if (div) {
        // div.scrollTop -= 100 // 没用？
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
