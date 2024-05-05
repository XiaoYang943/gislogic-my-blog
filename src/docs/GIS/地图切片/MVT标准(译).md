---
title: MVT标准(译)
category:
  - GIS
  - 矢量瓦片
  - MVT
---

:::tip
- 本篇文章主要是对[MVT标准](https://docs.mapbox.com/data/tilesets/guides/vector-tiles-standards/)的部分内容翻译，并添加了一些笔者的理解。
:::
## Vector tiles standards
- 该标准主要解释了地理信息数据是如何编码存储在[矢量瓦片](https://docs.mapbox.com/help/glossary/vector-tiles/)中的，包含以下内容
  - 格式
  - 几何如何编码
  - 属性如何编码
  - an explanation of the importance of winding order
- 其他诸如文件格式、数据结构、扩展、投影、bounds等信息从[Mapbox Vector Tile Specification](https://github.com/mapbox/vector-tile-spec)获取
## Format
- MVT编码方式参考了[Google Protobufs](https://github.com/protocolbuffers/protobuf),它允许序列化结构化的数据。
- [MVT的数据结构](https://github.com/mapbox/vector-tile-spec/blob/master/2.1/vector_tile.proto)
## Encoding geometry
- 将几何信息编码到MVT中必须要有以下步骤
  - 坐标转换
### 坐标转换
- 将地理坐标转换为瓦片的网格坐标
  - 即每一个瓦片都有一个瓦片坐标系
    - 瓦片左上角坐标为该瓦片的原点坐标(0,0)
    - 瓦片右下角坐标为该瓦片的extent坐标，例如(4096,4096)
## Encoding attributes
## Winding order
## Implementations
## What the spec doesn't cover
### How to use vector tiles as a dataset
### How to encode attributes that aren't strings or numbers
### Clipping
### Simplification