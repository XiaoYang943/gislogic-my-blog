---
title: GeoJSON
category:
  - GIS
  - 空间数据格式
  - GeoJSON
---
## RFC7946规范
### [数据类型](https://www.rfc-editor.org/rfc/rfc7946#section-1.4)
- `geometry types`
    - "Point"
    - "MultiPoint"
    - "LineString"
    - "MultiLineString"
    - "Polygon"
    - "MultiPolygon"
    - "GeometryCollection"
- `GeoJSON types`
    - "Feature"
    - "FeatureCollection"
    - ...以上七种`geometry types`
### [GeoJSON Object](https://www.rfc-editor.org/rfc/rfc7946#section-3)
- 每一个GeoJSON对象**必须**包含一个`type`属性，属性值**必须**符合前文的`GeoJSON types`
- **只有**`Feature`和`FeatureCollection`**可能**包含一个`bbox`属性，属性值**必须**符合[BBOX规范](https://www.rfc-editor.org/rfc/rfc7946#section-5)

    - 属性值**必须**是一个长度为2*n的数组(n为数据的维度)
        - 二维数据bbox：[边界框西南点坐标x,边界框西南点坐标y,边界框东北点坐标x,边界框东北点坐标y]
- 每一个GeoJSON对象**可能**包含其他[自定义的属性](https://www.rfc-editor.org/rfc/rfc7946#section-6)
### [Geometry Object](https://www.rfc-editor.org/rfc/rfc7946#section-3.1)
- 每一个geometry对象**必须**包含一个`type`属性，属性值**必须**符合前文的`geometry types`
- 除了`GeometryCollection`之外的任何geometry对象都**必须**包含一个`coordinates`属性，属性值的类型是一个数组
    - 数组的结构由几何体的类型决定
    - 每一个子数组的元素个数**必须**>=2，元素个数**可能**有3个，即经度、维度、高度
- 每一个geometry对象**不可能**包含如下属性
    - `features`
#### [Polygon](https://www.rfc-editor.org/rfc/rfc7946#section-3.1.6)
- 定义：A linear ring is the boundary of a surface or the boundary of a hole in a surface.(线性环是曲面的边界或曲面中孔的边界)
- 线性环`Polygon`**必须**是闭合的，至少是三点成面，`coordinates`至少是四个坐标，其中首尾坐标**必须**相同
- 线性环的边界区域的坐标**必须**遵循右手规则(right-hand)，即外环为逆时针方向，孔为顺时针方向(TODO:解析器是否应该不解析不符合右手规则的图形？)
- 单个环的多边形`Polygon`，`coordinates`的值**必须**是线性环形坐标数组的数组
- 多个环的多边形`Polygon`，`coordinates`的值第一个**必须**是外部环，其他任何环都**必须**是内部环
    - 外部环界定曲面，内部环（如果存在）界定曲面surface内的孔holes
### [Antimeridian Cutting](https://www.rfc-editor.org/rfc/rfc7946#section-3.1.9)
- [对向子午线(antimeridian)](https://baike.baidu.com/item/180%E5%BA%A6%E7%BB%8F%E7%BA%BF/8396631?fr=ge_ala):处理国内数据，无需关心
### [Feature Object](https://www.rfc-editor.org/rfc/rfc7946#section-3.2)
- 每一个Feature对象**必须**包含一个`type`属性，属性值**必须**是`Feature`
- 每一个Feature对象**必须**包含一个`geometry`属性，属性值**必须**符合前文的`Geometry object`
- 每一个Feature对象**可能**包含一个`properties`属性，属性值**必须**是一个JSON对象或null
- 每一个Feature对象**可能**包含一个`id`属性，属性值**必须**是一个string或number
- 每一个Feature对象**不可能**包含如下属性
    - `coordinates`
    - `geometries`
    - `geometry`
    - `properties`
    - `features`
### [FeatureCollection Object](https://www.rfc-editor.org/rfc/rfc7946#section-3.3)
- FeatureCollection对象**必须** 包含一个`features`属性，属性值**必须**是一个JSON数组，数组中每一个元素**必须**符合前文的`Feature object`，数组可以为空
- FeatureCollection对象**不可能** 包含如下属性
    - `coordinates`
    - `geometries`
    - `geometry`
    - `properties`
### [Coordinate Reference System](https://www.rfc-editor.org/rfc/rfc7946#section-4)
- GeoJSON使用的是WGS84地理坐标参考系统
### [Geometry Examples](https://www.rfc-editor.org/rfc/rfc7946#appendix-A)
### [Changes from the Pre-IETF GeoJSON Format Specification](https://www.rfc-editor.org/rfc/rfc7946#appendix-B)
### 参考标准
- [GJ2008(已过期的标准)](https://geojson.org/geojson-spec.html#link-objects)
- [IETF、RFC7946(本文章所参考的标准)](https://datatracker.ietf.org/doc/html/rfc7946)
