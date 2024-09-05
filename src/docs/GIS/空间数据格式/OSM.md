---
title: OSM
category:
  - GIS
  - 空间数据格式
  - 数据格式
  - OSM
---

## 数据下载
[geofabrik](https://download.geofabrik.de/asia/china.html)
## 数据导入到PostGIS
1. [下载导入工具osm2pgsql](https://github.com/osm2pgsql-dev/osm2pgsql)
2. 配置环境变量path
3. 导入`osm2pgsql -s -U postgres -H 127.0.0.1 -P 5432 -d postgres --hstore --style D:\my-store\osm\default.style --tag-transform D:\my-store\osm\style.lua --cache 12000 D:\my-store\osm\china-latest.osm.pbf`
    - 输入密码后报错`Connecting to database failed: connection to server at "127.0.0.1", port 5432 failed: fe_sendauth: no password supplied`
      - 解决:`\PostgreSQL\16\data\pg_hba.conf`文件-将`IPv4 local connections`和`IPv6 local connections`的`METHOD`改为`trust`




