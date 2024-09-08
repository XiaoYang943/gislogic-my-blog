---
title: MBTiles
category:
  - GIS
  - 空间数据格式
  - MBTiles
---

## [MBTiles规范](https://github.com/mapbox/mbtiles-spec/tree/master)
### 约定
::: tip
1. SQLite数据库的表table和视图view，在本文中统称为表table
2. **必须**要遵循的必须要遵循
3. SQLite数据库(3.0.0及以上版本)
4. MBTiles瓦片集中表的 'text' 类型的字段中的所有文本都**必须**编码为 UTF-8
:::

### 是什么
- MBTiles是一个在SQLite数据库中存储地图瓦片数据的数据格式
### metadata表(必须)
- key-value存储瓦片元数据
#### 必须有的字段
- `name` (text) 
- `value` (text)
#### 必须有的记录
##### `name` 
- 类型：string
- 含义：瓦片集的名称
##### `format`
- 类型：string
- 含义：瓦片数据的格式
  - `pbf`
  - `jpg`
  - `png`
  - `webp`
##### `json`
::: tip
- 如果`format`是mvt的`pbf`,该记录才是必须的
- 值必须是UTF-8编码
:::

- 类型：Stringified JSON object
- 含义：列出矢量切片中显示的图层以及这些图层中显示的要素属性的名称和类型
- 必须有`vector_layers`属性,其值是 JSON 对象数组,一个JSON对象描述的是一个图层
  - 每一个JSON对象必须包含如下k-v
    - `id` (string)
      - 图层id，即[Mapbox Vector Tile spec](https://github.com/mapbox/vector-tile-spec/tree/master/2.1#41-layers)中的图层name
    - `fields` (JSON object)
      - 图层的属性名称和属性类型
        - 属性类型 ：`"Number"`, `"Boolean"`, or `"String"`
  - 每一个JSON对象可以包含如下k-v
    - `description` (string)
    - `minzoom` (number): 此图层的最低缩放级别.必须>=整个瓦片集的`minzoom`
    - `maxzoom` (number): 此图层的最高缩放级别.必须<=整个瓦片集的`maxzoom`
  - 这些属性用于描述不同矢量图层集以同一瓦片集的不同缩放级别显示的情况，**例如，在“次要道路”图层仅存在于高缩放级别的情况下**
- 可以有`tilestats`属性
  - 详情见[mapbox-geostats](https://github.com/mapbox/mapbox-geostats#output-the-stats)
  - 和`vector_layers`类似，它列出了瓦片集的图层和在每个图层中的属性
#### 应该有的记录
##### `bounds`
- 类型：string of comma-separated numbers
- 含义 
  - The maximum extent of the rendered map area. 
  - Bounds must define an area covered by all zoom levels. 
  - The bounds are represented as `WGS 84`latitude and longitude values, in the OpenLayers Bounds format(left, bottom, right, top). 
    - For example, the `bounds` of the full Earth, minus the poles, would be:`-180.0,-85,180,85`.
##### `center`
- 类型：string of comma-separated numbers
- 含义
  - The longitude, latitude, and zoom level of the default view of the map. 
    - Example: `-122.1906,37.7599,11`
##### `minzoom`
- 类型：number
- 含义：The lowest zoom level for which the tileset provides data
##### `maxzoom`
- 类型：number
- 含义：The highest zoom level for which the tileset provides data
#### 可以有的记录
##### `attribution`
- 类型：HTML string 
- 含义：An attribution string, which explains the sources of data and/or style for the map.
##### `description`
- 类型：string 
- 含义：A description of the tileset's content. 
##### `type`
- 类型：string
- 值：`overlay` or `baselayer`
##### `version`
- 类型：number
- 含义：The version of the tileset.
#### example
::: details
* `name`: `TIGER 2016`
* `format`: `pbf`
* `bounds`: `-179.231086,-14.601813,179.859681,71.441059`
* `center`: `-84.375000,36.466030,5`
* `minzoom`: `0`
* `maxzoom`: `5`
* `attribution`: `United States Census`
* `description`: `US Census counties and primary roads`
* `type`: `overlay`
* `version`: `2`
* `json`:
```
    {
        "vector_layers": [
            {
                "id": "tl_2016_us_county",
                "description": "Census counties",
                "minzoom": 0,
                "maxzoom": 5,
                "fields": {
                    "ALAND": "Number",
                    "AWATER": "Number",
                    "GEOID": "String",
                    "MTFCC": "String",
                    "NAME": "String"
                }
            },
            {
                "id": "tl_2016_us_primaryroads",
                "description": "Census primary roads",
                "minzoom": 0,
                "maxzoom": 5,
                "fields": {
                    "FULLNAME": "String",
                    "LINEARID": "String",
                    "MTFCC": "String",
                    "RTTYP": "String"
                }
            }
        ],
        "tilestats": {
            "layerCount": 2,
            "layers": [
                {
                    "layer": "tl_2016_us_county",
                    "count": 3233,
                    "geometry": "Polygon",
                    "attributeCount": 5,
                    "attributes": [
                        {
                            "attribute": "ALAND",
                            "count": 6,
                            "type": "number",
                            "values": [
                                1000508839,
                                1001065264,
                                1001787870,
                                1002071716,
                                1002509543,
                                1003451714
                            ],
                            "min": 82093,
                            "max": 376825063576
                        },
                        {
                            "attribute": "AWATER",
                            "count": 6,
                            "type": "number",
                            "values": [
                                0,
                                100091246,
                                10017651,
                                100334057,
                                10040117,
                                1004128585
                            ],
                            "min": 0,
                            "max": 25190628850
                        },
                        {
                            "attribute": "GEOID",
                            "count": 6,
                            "type": "string",
                            "values": [
                                "01001",
                                "01003",
                                "01005",
                                "01007",
                                "01009",
                                "01011"
                            ]
                        },
                        {
                            "attribute": "MTFCC",
                            "count": 1,
                            "type": "string",
                            "values": [
                                "G4020"
                            ]
                        },
                        {
                            "attribute": "NAME",
                            "count": 6,
                            "type": "string",
                            "values": [
                                "Abbeville",
                                "Acadia",
                                "Accomack",
                                "Ada",
                                "Adair",
                                "Adams"
                            ]
                        }
                    ]
                },
                {
                    "layer": "tl_2016_us_primaryroads",
                    "count": 12509,
                    "geometry": "LineString",
                    "attributeCount": 4,
                    "attributes": [
                        {
                            "attribute": "FULLNAME",
                            "count": 6,
                            "type": "string",
                            "values": [
                                "1- 80",
                                "10",
                                "10-Hov Fwy",
                                "12th St",
                                "14 Th St",
                                "17th St NE"
                            ]
                        },
                        {
                            "attribute": "LINEARID",
                            "count": 6,
                            "type": "string",
                            "values": [
                                "1101000363000",
                                "1101000363004",
                                "1101019172643",
                                "1101019172644",
                                "1101019172674",
                                "1101019172675"
                            ]
                        },
                        {
                            "attribute": "MTFCC",
                            "count": 1,
                            "type": "string",
                            "values": [
                                "S1100"
                            ]
                        },
                        {
                            "attribute": "RTTYP",
                            "count": 6,
                            "type": "string",
                            "values": [
                                "C",
                                "I",
                                "M",
                                "O",
                                "S",
                                "U"
                            ]
                        }
                    ]
                }
            ]
        }
    }

```
:::
### tiles表(必须)
- 存储瓦片数据
#### 必须有的记录
- `zoom_level` (integer)
- `tile_column` (integer)
- `tile_row` (integer)
- `tile_data` (blob)
  - 值必须是raw binary image or vector tile data
##### 注意
::: tip
- zxy的值必须遵循[Tile Map Service Specification](http://wiki.osgeo.org/wiki/Tile_Map_Service_Specification)、[global-mercator](http://wiki.osgeo.org/wiki/Tile_Map_Service_Specification#global-mercator)
  - TMS规定，Y轴向上，因此 11327791 的切片以11、327、1256 的形式，因为 1256 为 2^11 - 1 - 791
:::
### grids表(可以有)
- 实现细节参考：[UTFGrid specification](https://github.com/mapbox/utfgrid-spec)
- 必须包含以 'gzip' 格式压缩的 UTFGrid 数据
#### 必须有的记录
- `zoom_level` (integer)
- `tile_column` (integer)
- `tile_row` (integer)
- `grid` (blob)
### grid_data表(可以有)
#### 必须有的记录
- `zoom_level` (integer)
- `tile_column` (integer)
- `tile_row` (integer)
- `key_name` (text)
- `key_json` (text)



