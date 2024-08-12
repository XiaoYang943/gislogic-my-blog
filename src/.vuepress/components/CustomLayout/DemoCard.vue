<template>
  <el-container>
    <!-- height 固定header -->
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
              :title="item.value"
              style="margin-right: 50px"
              v-html="filterTitle(item.value)"
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
        image="src/assets/404.png"
        image-size="450"
      >
      </el-empty>
      <template v-for="item in reactiveData.cardList" :key="item.id">
        <el-card
          v-if="item.type === 'directory'"
          :id="item.id"
          class="card-parent"
        >
          <template #header>
            <div class="card-header-parent">
              <span>{{ item.name }}</span>
            </div>
          </template>
          <div v-for="childItem in item.children" :key="childItem.id">
            <el-card
              v-if="childItem.isShow"
              class="card-children"
              shadow="hover"
            >
              <template #header>
                <div class="card-header-children">
                  <span
                    :title="childItem.name.split('-')[1]"
                    v-html="filterTitle(childItem.name.split('-')[1])"
                  ></span>
                  <div class="keyword-container">
                    <el-tag
                      v-for="keyword in childItem.keywords"
                      :key="keyword"
                      size="small"
                      >{{ keyword }}
                    </el-tag>
                  </div>
                </div>
              </template>
              <el-image
                :src="childItem.imgPath"
                fit="fill"
                lazy
                style="width: 100%; height: 100%; cursor: pointer"
                @click="open(childItem)"
              ></el-image>

              <div class="bottom">
                <span>{{ childItem.description }}</span>
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
// import { useRouter } from 'vue-router'

const { $bus } = getCurrentInstance()!.appContext.config.globalProperties
// const router = useRouter()
const props = defineProps({
  menuList: Array
})
let keyword = ref('')
let searchList: any[] = []
// reactive声明的变量，赋值后会丢失响应式，要包一层
let reactiveData = reactive({
  cardList: [] as any
})
onMounted(() => {
  $bus.on('clearInput', () => {
    keyword.value = ''
  })
})
// 监听异步数据何时传入
watch(
  () => props.menuList, //监听
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

const check = (data: any, list: any) => {
  data.forEach((item: any) => {
    if (item.children && item.children.length > 0) {
      check(item.children, list)
    } else {
      if (!item.name || !item.description) {
        return
      } else {
        list.push({
          path: item.path,
          value: item.name,
          type: item.type,
          imgPath: item.imgPath,
          description: item.description,
          isShow: item.isShow,
          id: item.id
        })
        // list.push(item); // 为什么直接传item报错
      }
    }
  })
  return list
}

function querySearch(queryString: any, cb: any) {
  // 在拉平的数组中搜索的结果

  let temp = queryString
    ? searchList.filter(createFilter(queryString))
    : searchList
  let ids = temp.map((item) => {
    return item.id
  })

  // 根据id数组在源数据中搜索的结果
  let result = filterArr(props.menuList, ids)
  reactiveData.cardList = result
  cb(temp)
}

function filterArr(arr: any, ids: any) {
  return arr.reduce((list: any, item: any) => {
    let has = ids.includes(item.id)
    let res = { ...item }
    if (!has && Array.isArray(item.children)) {
      res.children = filterArr(item.children, ids)
      has = !!res.children.length
    }

    has && list.push(res)
    return list
  }, [])
}

function createFilter(queryString: any) {
  return (restaurant: any) => {
    return (
      //restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) == 0
      /*index==0表示是否在第一个索引位置找到输入的字符，*/
      restaurant.value.indexOf(queryString) != -1 && restaurant.isShow //这个语句表示只有有关键字即可，不论在哪个位置匹配到
    )
  }
}

//输入选定的值
function handleSelect(selectedItem: any) {
  let ids = [selectedItem.id]
  // 根据id数组在源数据中搜索的结果
  let result = filterArr(props.menuList, ids)
  reactiveData.cardList = result
}

// 给每个结果中匹配字符高亮
function filterTitle(originStr: any) {
  if (!keyword.value) {
    return originStr
  }
  // 将匹配的字符添加一个‘高亮’的标签外表
  let str = keyword.value
  const regEscape = (v: any) => {
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

function open(childItem: any) {
  // router.push(childItem.path)
}
</script>

<style lang="scss" scoped>
.card-parent {
  margin: 30px;
}

.card-parent {
  :deep(.el-card__body) {
    /*水平排列，自动换行*/
    display: flex;
    flex-flow: row wrap;
    padding: 0;
  }
}

.bottom {
  font-size: 12px;
  padding: 5px;
}

.card-children {
  margin: 10px;
  width: 235px;
  /**主轴y轴，图片和文字上下排列 */
  display: flex;
  flex-direction: column;
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

.keyword-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px 0 0 0;
}

.card-header-parent {
  text-shadow: 0 0 black;
  font-size: 20px;
}

// 固定header
.el-main {
  background-color: #f5f7f9;
  height: calc(100vh - 2rem);
}
</style>
