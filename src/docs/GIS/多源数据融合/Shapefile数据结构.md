---
title: Shapefile文件格式
category:
  - 待归档
  - 多源数据融合
---
## Shapefile
- 文件结构
    - 必须的
        - `.shp`图形格式，保存几何对象
        - `.shx`图形索引格式，保存几何对象的位置索引，记录每一个几何对象在.shp文件中的位置
        - `.dbf`属性数据格式
    - 非必须的
        - `.prj`保存地理坐标系与投影坐标系，存储WKT格式数据
        - `.sbnand.sbx`几何对象的空间索引
        - `.fbnand.fbx`只读的Shapefile中的几何对象的空间索引
        - `.ainand.aih`列表中活动字段的属性索引
        - `.ixs`可读写Shapefile的地理编码索引
        - `.atx.dbf`文件的属性索引
        - `.shp.xml`以XML格式保存元数据
        - `.cpg`用于描述.dbf文件的代码页，指明其使用的字符编码