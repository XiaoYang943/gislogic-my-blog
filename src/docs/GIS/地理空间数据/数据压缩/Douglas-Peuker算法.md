---
title: Douglas-Peuker算法
article: true
category:
  - GIS
  - 地理空间数据
  - 空间数据组织算法
  - 数据压缩
---
## Douglas-Peuker算法
### 原理
1. 将一条曲线的`两个端点A、B`连一条`直线line`，求出其他`中间点P`到该`直线line`的`距离distance`，并取`最大值max`
2. 将该`最大值max`与规定的`阈值threshold`比较
3. 若大于`阈值threshold`，则该`最大值点max`保留，更新`端点为A、B、max`，重复以上步骤...(此时`line1`为`A、max`，`line2`为`max、B`)
4. 否则将直线line两个端点之间的所有点舍去
![原理](https://blog-image-9943.oss-cn-beijing.aliyuncs.com/202309171414524.png)
::: details 测试数据
LINESTRING (-4 426, 3 418, 9 410, 15 402, 22 394, 28 386, 34 378, 40 370, 46 362, 53 354, 59 346, 66 338, 73 330, 80 322, 87 314, 94 306, 102 299, 110 292, 118 286, 126 279, 134 273, 143 268, 151 262, 159 256, 169 252, 178 247, 187 242, 197 238, 207 235, 217 232, 227 229, 237 228, 247 228, 257 228, 267 228, 277 229, 287 230, 297 232, 307 235, 317 237, 327 241, 337 245, 345 251, 353 257, 361 263, 369 269, 377 275, 386 281, 394 288, 402 296, 410 304, 416 312, 422 320, 428 328, 432 338, 436 348, 440 358, 443 368, 449 376, 455 384, 461 392, 467 400, 474 408, 482 415, 489 423, 494 431)
:::
### 参考文章
- [参考文章](https://malagis.com/gis-algorithm-douglas-peuker-algorithm-principle-illustration.html)
- [参考文章](https://my.oschina.net/boonya/blog/3038997)
- [参考文章](https://blog.csdn.net/n009ww/article/details/90669282)
## GeoTools中的实现
- `org.geotools.process.vector.SimplifyProcess`
- `execute(SimpleFeatureCollection features, double distance, boolean preserveTopology)`
  - features：输入的要素集合
  - distance：简化距离公差(阈值)
  - preserveTopology：如果为false，使用道格拉斯-普克法。否则使用确保拓扑有效的方法
  - 返回值：SimpleFeatureCollection，简单要素集合
