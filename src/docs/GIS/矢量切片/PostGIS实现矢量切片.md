---
title: PostGIS实现矢量切片
category:
  - GIS
  - 矢量切片
---
## [ST_TileEnvelope](https://postgis.net/docs/manual-dev/ST_TileEnvelope.html)
### 函数签名
```
geometry ST_TileEnvelope(
    integer tileZoom, 
    integer tileX, 
    integer tileY, 
    geometry bounds=SRID=3857;LINESTRING(-20037508.342789 -20037508.342789,20037508.342789 20037508.342789), 
    float margin=0.0    
)
```
### 参数
- tileZoom
  - 缩放等级z
- tileX
  - 瓦片x索引
- tileY
  - 瓦片Y索引
- bounds
  - 可选，边界参数可用于在任何坐标系中生成瓦片
- margin
  - 可选，margin=0.125使瓦片扩展12.5%，这对于创建分幅缓冲区以包括位于分幅可见区域之外但其存在会影响分幅渲染的数据非常有用
    - 例如，一个城市名称（一个点）可能位于一个瓦片的边缘附近，因此其标签应在两个瓦片上呈现，即使该点仅位于一个瓦片的可见区域中
  - 值域：(-0.5,1]
  - 和`ST_AsMVTGeom`一起使用时，不要指定该参数
### 返回值
- 创建矩形多边形tile envelope
  - 生成的tile envelope 的默认坐标系：Web Mercator coordinate system (SRID:3857)，即MVT瓦片的常用坐标系
### 应用场景
- 用于`ST_AsMVTGeom`将几何图形转换为MVT瓦片坐标空间所需的瓦片边界
### 参考
## [ST_AsMVTGeom](https://postgis.net/docs/manual-dev/ST_AsMVTGeom.html)
### 函数签名
```
geometry ST_AsMVTGeom(
    geometry geom, 
    box2d bounds, 
    integer extent=4096, 
    integer buffer=256, 
    boolean clip_geom=true
);
```
### 参数
- geom：要转换的geom
- bounds：`ST_TileEnvelope`生成的瓦片边界(no margin buffer)
- extent：范围是由MVT规范定义的瓦片范围大小。默认值为4096
- buffer：裁剪所需的缓冲区大小。默认256
- clip_geom：是否裁剪geom
### 返回值
- 将标准的geom转换为符合[MVT](https://www.mapbox.com/vector-tiles/)标准的mvtGeom
  - geom通常是3857，如需转换，使用[ST_Transform](https://postgis.net/docs/manual-dev/ST_Transform.html)
### 测试sql
```sql
SELECT ST_AsText(ST_AsMVTGeom(
	ST_GeomFromText('POLYGON ((0 0, 10 0, 10 5, 0 -5, 0 0))'),
	ST_MakeBox2D(ST_Point(0, 0), ST_Point(4096, 4096)),
	4096, 0, false));

-- MULTIPOLYGON(((5 4096,10 4091,10 4096,5 4096)),((5 4096,0 4101,0 4096,5 4096)))
```
## [ST_AsMVT](https://postgis.net/docs/manual-dev/ST_AsMVT.html)
### 函数签名
```
bytea ST_AsMVT(anyelement set row);
```
```
bytea ST_AsMVT(
  anyelement row, 
  text name, 
  integer extent, 
  text geom_name, 
  text feature_id_name
);
```
### 参数
- row：记录，必须包含一个`ST_AsMVTGeom`转换后的geom字段，该字段将被编码为feature的geom属性，其他字段被编码为feature的其他属性
- name：layer的名称。默认值为default
- extent：是由规范定义的屏幕空间中的瓦片范围。默认值为4096。
- geom_name：geom字段名称
- feature_id_name：id字段名称
### 返回值
- 返回符合MVT规范的二进制矢量瓦片