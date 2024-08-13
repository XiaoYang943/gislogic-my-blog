<template>
  <div class="theme-container no-sidebar">
    <div >
      <Navbar/>
    </div>
    <div id="main-content" class="vp-project-home">
      <el-container style="max-height: 805px;">
        <el-row style="width: 100%; margin: 0px 10px">
          <el-col :span="3" style="width: 100%;height: 100%">
            <Aside
                :menuList="data.menuList"
                style="height: 100%; width: auto"
            ></Aside>
          </el-col>
          <el-col :span="21" style="height: 100%;">
            <MainCard :menuList="data.cardList"></MainCard>
          </el-col>
        </el-row>
      </el-container>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {getCurrentInstance, reactive} from "vue";
import Navbar from 'vuepress-theme-hope/modules/navbar/components/Navbar.js';
import Aside from "./Aside.vue";
import MainCard from "./MainCard.vue";
let data = reactive({
  menuList: [] as any,
  cardList: [] as any
})
const { $axios } = getCurrentInstance()!.appContext.config.globalProperties
$axios
    .get('/tools-nav-tree.json')
    .then((res: any) => {
      if (res.status == 200) {
        data.menuList = res.data
        data.cardList = res.data
      }
    })
</script>

<style scoped>
.el-container .is-vertical {
  height: 100%;
}
</style>