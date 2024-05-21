---
title: Geobuf
category:
  - GIS
  - 多源数据融合
  - 数据格式
  - GeoJSON
  - Geobuf
---
## Geobuf
- [官网](https://github.com/mapbox/geobuf)
### 是什么
- Geobuf是一种用于地理空间数据的二进制序列化格式，将GeoJSON数据近乎无损(坐标编码精度为小数点后6位数)地压缩到**[协议缓冲区](https://developers.google.com/protocol-buffers/)中**
### 什么用
- 数据结构紧凑、体积小，通常可将 GeoJSON 缩小 6-8 倍
- 编码和解码速度极快，甚至比本地 JSON 解析/字符串化还要快
- 可容纳任何 GeoJSON 数据，包括具有任意属性的扩展
- 较便捷地实现增量解析(Incremental Parsing)，即只读取需要的Features，无需为整个数据集建立内存关系
### 如何实现
- [geobuf.proto](https://github.com/mapbox/geobuf/blob/master/geobuf.proto)