<template>
  <el-container>
    <el-header
      height="2rem"
      style="display: flex; justify-content: center; background-color: #f5f7f9"
    >
      <el-autocomplete
        v-model="keyword"
        :fetch-suggestions="querySearch"
        :trigger-on-focus="false"
        clearable
        placeholder="请输入关键字搜索"
        style="width: 270px"
        @select="handleSelect"
      >
        <template #default="{ item }">
          <div>
            <span
              :title="item.name"
              style="margin-right: 50px"
              v-html="filterTitle(item.name)"
            ></span>
            <span
              :title="item.description"
              style="float: right"
              v-html="filterTitle(item.description)"
            ></span>
          </div>
        </template>
      </el-autocomplete>
    </el-header>
    <el-main>
      <el-empty
        v-if="reactiveData.cardList.length === 0"
        description="没有搜索出结果，请重新搜索！"
        image-size="450"
      >
      </el-empty>
      <template v-for="item in reactiveData.cardList">
        <el-card
          v-if="item.children"
          class="card-parent"
          :id="item.name"
        >
          <template #header>
            <div class="card-header-parent">
              <span>{{ item.name }}</span>
            </div>
          </template>
          <div v-for="childItem in item.children">
            <el-card
              class="card-children"
              shadow="hover"
              @click="open(childItem)"
            >
              <el-image
                  :src="childItem.imgPath"
                  fit="contain"
                  lazy
                  style="height: 40px;width: 40px"
              ></el-image>

              <div style="display: flex;flex-direction: column;margin-left: 10px">
                 <span
                     :title="childItem.name"
                     v-html="filterTitle(childItem.name)"
                     style="font-size: 16px"
                 ></span>
                <span
                    :title="childItem.description"
                    v-html="filterTitle(childItem.description)"
                    style="font-size: 12px"
                ></span>
              </div>

            </el-card>
          </div>
        </el-card>
      </template>
    </el-main>
  </el-container>
</template>
<script lang="ts" setup>
import { getCurrentInstance, onMounted, reactive, ref, watch } from 'vue'
const { $bus } = getCurrentInstance()!.appContext.config.globalProperties
const props = defineProps({
  menuList: Array<NavigationItem>
})
interface NavigationItem {
  path: string
  name: string
  imgPath: string
  description: string
}
let keyword = ref('')
let searchList: NavigationItem[] = []
let reactiveData = reactive({
  cardList: [] as any
})

onMounted(() => {
  $bus.on('clearInput', () => {
    keyword.value = ''
  })
})
watch(
  () => props.menuList,
  () => {
    // 拉平后的待搜索列表
    searchList = check(props.menuList, [])
    // 默认加载全部card
    reactiveData.cardList = props.menuList
  }
)

watch(
  () => keyword,
  (newValue) => {
    // 清空input时，加载默认的全部card
    if (newValue.value === '') {
      reactiveData.cardList = props.menuList
    }
  },
  { immediate: true, deep: true }
)

const check = (data: any, list: Array<NavigationItem>) => {
  data.forEach((item: any) => {
    if (item.children && item.children.length > 0) {
      check(item.children, list)
    } else {
      list.push({...item})
    }
  })
  return list
}

function querySearch(queryString: string, cb: any) {
  // 在拉平的数组中搜索的结果
  let temp = queryString
    ? searchList.filter(createFilter(queryString))
    : searchList
  let paths = temp.map((item) => {
    return item.path
  })
  reactiveData.cardList = filterArr(props.menuList, paths)
  cb(temp)
}

function filterArr(arr: Array<NavigationItem>, paths: Array<string>) {
  return arr.reduce((list: Array<NavigationItem>, item: any) => {
    let has = paths.includes(item.path)
    let res = { ...item }
    if (!has && Array.isArray(item.children)) {
      res.children = filterArr(item.children, paths)
      has = !!res.children.length
    }
    has && list.push(res)
    return list
  }, [])
}



function createFilter(queryString: string) {
  return (navigation: NavigationItem) => {
    return match(queryString,navigation.name) || match(queryString,navigation.description)
  };
}

const match = (queryString:string,propsName:string) => {
  return propsName.toLowerCase().match(queryString.toLowerCase())
}
/**
 * 下拉菜单选中
 * @param selectedItem
 */
function handleSelect(selectedItem: NavigationItem) {
  let ids = [selectedItem.path]
  // 根据id数组在源数据中搜索的结果
  let result = filterArr(props.menuList, ids)
  reactiveData.cardList = result
}

// 给每个结果中匹配字符高亮
function filterTitle(originStr: string) {
  if (!keyword.value) {
    return originStr
  }
  // 将匹配的字符添加一个‘高亮’的标签外表
  let str = keyword.value
  const regEscape = (v: string) => {
    if (v) {
      return v.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
    }
  }
  if (originStr) {
    return originStr.replace(
      new RegExp(regEscape(str), 'ig'),
      '<span style="color: #2cc0da">$&</span>'
    )
  }
}

function open(childItem: NavigationItem) {
  window.open(childItem.path)
}
</script>

<style lang="scss" scoped>
.card-parent {
  margin: 30px;
}

.card-parent {
  :deep(.el-card__body) {
    display: flex;
    flex-flow: row wrap;
    padding: 0;
    margin: 10px 15px;
  }
}

.bottom {
  font-size: 12px;
  padding: 5px;
}

.card-children {
  margin: 10px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  max-height: 60px;
}

.card-children ::v-deep(.el-card__header) {
  padding: 18px 20px 18px 20px;
  float: left;
}

.card-header-children {
  text-align: center;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card-header-parent {
  text-shadow: 0 0 black;
  font-size: 20px;
}

.el-main {
  background-color: #f5f7f9;
  height: calc(100vh - 2rem);
}
</style>
