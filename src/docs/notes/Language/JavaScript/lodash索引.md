---
title: lodash
article: false
category:
  - JavaScript
---
## 数组
### 分割数组
_.chunk(array, [size=1])  
### 拼接数组
_.concat(array, [values])  
### 删除数组元素
#### 过滤数组
##### 过滤假值，返回新数组
_.compact(array)  
##### 过滤指定的值，返回新数组
_.difference(array, [values])  
_.differenceBy(array, [values], [iteratee=_.identity])  
_.differenceWith(array, [values], [comparator])  
##### 过滤指定的值（断言函数），返回原数组或新数组
_.remove(array, [predicate=_.identity])  
##### 去重，返回新数组
_.uniq(array)  
_.uniqBy(array, [iteratee=_.identity])  
_.uniqWith(array, [comparator])  
#### 根据指定的个数，删除数组元素，返回原数组
_.drop(array, [n=1])  
_.dropRight(array, [n=1])  
_.dropRightWhile(array, [predicate=_.identity])  
_.dropWhile(array, [predicate=_.identity])  
##### 子主题
_.take(array, [n=1])  
_.takeRight(array, [n=1])  
_.takeRightWhile(array, [predicate=_.identity])  
_.takeWhile(array, [predicate=_.identity])  
#### 删除最后一个元素，返回原数组
_.initial(array)
#### 删除第一个元素，返回原数组
_.tail(array)
#### 删除与指定值相同的元素
##### 返回原数组
_.pull(array, [values])  
_.pullAll(array, values)  
_.pullAllBy(array, values, [iteratee=_.identity])  
_.pullAllWith(array, values, [comparator])  
##### 返回新数组
_.without(array, [values])
#### 根据指定的索引，删除数组元素，返回原数组或新数组
_.pullAt(array, [indexes])
#### 返回删掉的元素
_.slice(array, [start=0], [end=array.length])  
### 替换数组元素
_.fill(array, value, [start=0], [end=array.length])  
### 查找数组元素
#### 根据索引（断言函数），查找元素，返回索引值
_.findIndex(array, [predicate=_.identity], [fromIndex=0])  
_.findLastIndex(array, [predicate=_.identity], [fromIndex=array.length-1])  
#### 查找数组的第一个、最后一个元素，返回该元素值
_.head(array)  
_.last(array)  
#### 查找数组第一次出现指定元素的位置，返回索引值
_.indexOf(array, value, [fromIndex=0])  
_.lastIndexOf(array, value, [fromIndex=array.length-1])  
#### 根据第几个的个数，查找元素，返回该元素值
_.nth(array, [n=0])
### 减少数组嵌套层级
_.flatten(array)  
_.flattenDeep(array)  
_.flattenDepth(array, [depth=1])  
### 数组转对象
_.fromPairs(pairs)
### 数组元素求交
_.intersection([arrays])
_.intersectionBy([arrays], [iteratee=_.identity])
_.intersectionWith([arrays], [comparator])
### 数组元素求并
_.union([arrays])  
_.unionBy([arrays], [iteratee=_.identity])  
_.unionWith([arrays], [comparator])  
_.xor([arrays])  
_.xorBy([arrays], [iteratee=_.identity])  
_.xorWith([arrays], [comparator])  
_.zip([arrays])  
_.zipObject([props=[]], [values=[]])  
_.zipObjectDeep([props=[]], [values=[]])  
_.zipWith([arrays], [iteratee=_.identity])  
### 提取数组元素并用字符串拼接
_.join(array, [separator=','])
### 翻转数组元素
_.reverse(array)
### 排序
_.sortedIndex(array, value)  
_.sortedIndexBy(array, value, [iteratee=_.identity])  
_.sortedIndexOf(array, value)  
_.sortedLastIndex(array, value)  
_.sortedLastIndex(array, value)  
_.sortedLastIndexOf(array, value)  
_.sortedUniq(array)  
_.sortedUniqBy(array, [iteratee])  