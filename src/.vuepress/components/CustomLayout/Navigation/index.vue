<template>
  <div class="theme-container no-sidebar">
    <div>
      <Navbar/>
    </div>
    <div id="main-content" class="vp-project-home">
      <el-container style="max-height: 895px;display: flex;flex-direction: column">
        <el-autocomplete
            v-model="data.keyword"
            :fetch-suggestions="querySearch"
            :trigger-on-focus="false"
            clearable
            placeholder="请输入关键字搜索"
            style="margin: 20px auto;width: 25%"
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
        <div style="margin: 0 auto;width: 50%">
          <el-check-tag v-for="item in data.tagList"
                        :key="item.id"
                        v-model="data.selectedTagId"
                        :class="{active: data.selectedTagId.includes(item.id)}"
                        :value="item.id"
                        class="mr10 custom-tag"
                        size="small"
                        @change="onChange(item.id)">{{ item.name }}
          </el-check-tag>
        </div>
        <div style="margin: 20px auto;width: 80%;height: 100%;display: flex;flex-direction: row;flex-flow: wrap">
          <el-card
              v-for="childItem in data.cardList"
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
                     style="font-size: 16px"
                     v-html="filterTitle(childItem.name)"
                 ></span>
              <span
                  :title="childItem.description"
                  style="font-size: 12px"
                  v-html="filterTitle(childItem.description)"
              ></span>
            </div>

          </el-card>
        </div>

      </el-container>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, reactive, watch} from "vue";
import Navbar from 'vuepress-theme-hope/modules/navbar/components/Navbar.js';
import jsonData from '../../../public/navigation.json'
import {clone} from "lodash-es"
import {getUuid} from "../../../utils";
// TODO: tag搜索
type Tag = {
  name: string,
  id: string,
  checked: boolean
}
type Card = {
  path: string
  name: string
  imgPath: string
  description: string
  tag: string[]
}
const data = reactive({
  cardList: [],
  tagList: [], // 所有tag
  selectedTagId: [],  // 勾选的tagId
  cardListCloned: [],
  keyword: '', // 搜索框绑定值
  keywordCopy: '', // 搜索框绑定值的副本
})


// 选择下拉列表的回调
function handleSelect(selectedCard: Card) {
  data.cardList = data.cardListCloned.filter((card) => {
    return card === selectedCard
  })
  data.keyword = data.keywordCopy // 点击下拉框后 keyword 会被清空，不会有 clearable 清除按钮
  // TODO 取消勾选其他tags
}

// 搜索框搜索
const querySearch = (queryString: string, cb: any) => {
  const results = queryString
      ? data.cardList.filter(createFilter(queryString))
      : data.cardList
  cb(results)
}
// 搜索框的匹配逻辑
const match = (queryString: string, propsName: string) => {
  return propsName.toLowerCase().match(queryString.toLowerCase())
}

// 搜索框的过滤器
function createFilter(queryString: string) {
  return (navigation: Card) => {
    return match(queryString, navigation.name) || match(queryString, navigation.description)
  };
}

// 搜索 高亮文本
function filterTitle(originStr: string) {
  if (!data.keyword) {
    return originStr
  }
  // 将匹配的字符添加一个‘高亮’的标签外表
  let str = data.keyword
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

// card的click事件
function open(childItem: Card) {
  window.open(childItem.path)
}

// tag的change事件
const onChange = (tagId: string) => {
  if (data.selectedTagId.includes(tagId)) {
    data.selectedTagId.splice(data.selectedTagId.indexOf(tagId), 1)
  } else {
    data.selectedTagId.push(tagId)
  }
}

/**
 * 按照name属性a-z-中文的规则排序数组
 * @param arr
 */
function sortArrayByName(arr: Array<{ name: string }>): Array<{ name: string }> {
  return arr.sort((a, b) => {
    // 判断字符串是否以中文开头
    function startsWithChinese(str: string): boolean {
      const firstCharCode = str.charCodeAt(0);
      return firstCharCode >= 0x4E00 && firstCharCode <= 0x9FA5;
    }

    // 如果两个字符串都不以中文开头，则按英文排序
    if (!startsWithChinese(a.name) && !startsWithChinese(b.name)) {
      return a.name.localeCompare(b.name);
    }

    // 如果a以中文开头，b不以中文开头，则b在前
    if (startsWithChinese(a.name) && !startsWithChinese(b.name)) {
      return 1;
    }

    // 如果b以中文开头，a不以中文开头，则a在前
    if (!startsWithChinese(a.name) && startsWithChinese(b.name)) {
      return -1;
    }

    // 如果两个字符串都以中文开头，则按英文排序
    return a.name.localeCompare(b.name);
  });
}

// 根据默认card-json计算默认tag列表
const getDefaultTagArr = () => {
  let tempTagArr = [] // 去重后的tagName
  data.cardList.forEach((card) => {
    card.tag.forEach(tagName => {
      if (!tempTagArr.includes(tagName)) {
        tempTagArr.push(tagName)
      }
    })
  })

  let tagSet = []
  tempTagArr.forEach((tagName) => {
    let tag = {} as Tag
    tag.name = tagName
    tag.id = getUuid()
    tag.checked = false
    tagSet.push(tag)
  })
  return tagSet
}
onMounted(() => {
  data.cardList = sortArrayByName(jsonData)
  data.tagList = getDefaultTagArr()
  data.cardListCloned = clone(data.cardList)
})
watch(
    () => data.keyword,
    (newVal) => {
      // 清空搜索框input
      if (newVal === '') {
        data.cardList = data.cardListCloned // 加载默认的全部card
        data.selectedTagId = []  // 取消所有tag勾选
      }
      data.keywordCopy = newVal
    }
)
watch(
    () => data.selectedTagId,
    (newVal) => {
      if (newVal.length === 0) {
        data.cardList = data.cardListCloned
      } else {
        let selectedTagName = []
        newVal.forEach((selectedTagId) => {
          let tempTag = data.tagList.find((tag) => {
            return tag.id === selectedTagId
          })
          selectedTagName.push(tempTag.name)
        })
        data.cardList = data.cardListCloned.filter((card) => {
          return card.tag.some(item => selectedTagName.includes(item));
        })
      }
    }, {
      deep: true
    }
)


</script>

<style lang="less" scoped>
.el-container .is-vertical {
  height: 100%;
}

.custom-tag {
  color: #15d292;
  background-color: #e9f8f3;
  margin: 0 5px 10px;
}

.active {
  color: #409eff;
  background-color: #d9ecff;
}


.card-children {
  :deep(.el-card__body) {
    display: flex;
    flex-flow: row wrap;
    padding: 0;
    margin: 10px 15px;
  }

  margin: 0 20px 20px 0;
  cursor: pointer;
}
</style>