---
title: FlatGeobuf
category:
  - GIS
  - 多源数据融合
---
## FlatGeobuf
### 是什么
- FlatGeobuf是地理空间数据的一种二进制编码方式
- 基于Google的[flatbuffers](http://google.github.io/flatbuffers/)
- 灵感来自于mapbox的[geobuf](https://github.com/mapbox/geobuf)和[flatbush](https://github.com/mourner/flatbush)
### 特点
- 不支持随机写入
- 聚集数据到[Packed_Hilbert_R-trees](https://en.wikipedia.org/wiki/Hilbert_R-tree#Packed_Hilbert_R-trees),能快速地进行bbox空间过滤
- 空间索引是可选的，以便将格式有效地写成流，支持追加，并适用于不需要空间过滤的情况
### 什么用
- 是海量数据传输的一种方法
  - 传输速度明显快于传统格式
    - [对不同地理空间数据格式的存储、文件数量和读取速度进行比较分析](https://github.com/geografope/vectorial-spatial-formats)
    - [Shapefile存在的问题](http://switchfromshapefile.org/)
  - 对内容或元信息的大小没有限制
  - 适合流式传输/随机访问
#### examples
- [流式传输渲染](https://observablehq.com/@bjornharrtell/streaming-flatgeobuf)
- [Openlayers](https://flatgeobuf.org/examples/openlayers)
- [Leaflet](https://flatgeobuf.org/examples/leaflet/)
- [Mapbox/Maplibre](https://flatgeobuf.org/examples/maplibre/)
#### [性能](https://flatgeobuf.org/#performance)
#### [库](https://flatgeobuf.org/#supported-applications--libraries)
#### [Docs](https://flatgeobuf.org/#documentation)
## [常见问题](https://flatgeobuf.org/#faq)
### 为什么不使用WKB编码
### 为什么不使用Protobuf
## 参考文章
- [官网](https://flatgeobuf.org/)

