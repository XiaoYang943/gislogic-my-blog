---
title: MapboxStyle
category:
  - GIS
  - 空间数据格式
  - MapboxStyle
---

::: tip
- 本文是对[MapboxStyle standards v14.5.2](https://docs.mapbox.com/style-spec/reference/)的整理，主要是整理校验规则
  - warning：仅做提示，不报错
  - caution：报错
- 注意查看属性的`SDK Support`，以保证版本兼容性
:::

## Root
### layers(caution)

::: caution

- 必填

:::

### sources(caution)

::: caution

- 必填

:::

### version(caution)

::: caution

- 必填
- 值必须是8

:::

### bearing
### camera
### center
### color-theme
### fog
### fragment
### glyphs(caution)

::: caution

- 如果任何图层使用了`text-field`属性，则该项为必填
- URL必须为绝对路径
:::

### imports
### light
### lights
### metadata
### models
### name
### pitch
### projection
### schema
### sprite(caution)

::: caution

- 如果任何图层使用了`background-pattern`, `fill-pattern`, `line-pattern`, `fill-extrusion-pattern`, or `icon-image`属性，则该项为必填
- URL必须为绝对路径

:::

### terrain
### transition
### zoom
## Lights
## Sources
### vector
#### attribution
#### bounds
#### maxzoom
#### minzoom
#### promoteId
#### scheme
#### tiles(caution)

::: caution

- 如果`url`属性没有提供，则该项为必填

:::

#### url(caution)

::: caution

- 如果`tiles`属性没有提供，则该项为必填

:::

#### volatile
## Sprite

::: tip
- 是否做该文件的校验
:::

## Glyphs
## Imports
### id(caution)

::: caution

- 必填

:::

### url(caution)

::: caution

- 必填

:::

### config
### data
## Slots
## Configuration
### Schema
### Option
#### default(caution)

::: caution

- 必填

:::

#### array
#### maxValue
#### metadata
#### minValue
#### stepValue
#### type
#### values
## Transition
## Projection
### name(caution)

::: caution

- 必填

:::

### center
### parallels
## Terrain
### source(caution)

::: caution

- 必填

:::

### exaggeration
## Fog
## Layers
### Layer properties
#### id(caution)

::: caution

- 必填

:::

#### type(caution)

::: caution

- 必填

:::

#### filter
#### layout
#### maxzoom
#### metadata
#### minzoom
#### paint
#### slot
#### source(caution)

::: caution

- 除了`background` and `slot`，其他必填

:::

#### source-layer(caution)

::: caution

- `vector` 和 `raster-array` 类型的source，该项为必填。其他类型的source，不能设置该项

:::

## Types
## Expressions
## Other


## 模板(复制用)

::: tip

:::

::: warning

:::

::: caution

:::