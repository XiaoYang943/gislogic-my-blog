<template>
  <el-container style="max-height: 805px;">
    <el-row style="width: 100%; margin: 0px 10px">
      <el-col :span="3" style="width: 100%;height: 100%">
        <DemoAside
            :menuList="data.menuList"
            style="height: 100%; width: auto"
        ></DemoAside>
      </el-col>
      <el-col :span="21" style="height: 100%;">
        <DemoCard :menuList="data.cardList"></DemoCard>
      </el-col>
    </el-row>
  </el-container>
</template>
<script lang="ts" setup>
import {onBeforeMount, reactive } from 'vue'
import DemoAside from './DemoAside.vue'
import DemoCard from './DemoCard.vue'
import jsonData from '../../public/examples-tree.json'
let data = reactive({
  menuList: [] as any,
  cardList: [] as any
})

onBeforeMount(() => {
  data.menuList = jsonData
  data.cardList = jsonData
})
</script>

<style scoped>
.el-container .is-vertical {
  height: 100%;
}
</style>
