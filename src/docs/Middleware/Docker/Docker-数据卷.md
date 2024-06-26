---
title: Docker-数据卷
article: false
category:
  - 中间件
  - Docker
---
## 容器的数据卷(volumes)
### 数据卷实现容器数据的持久化
- Docker 容器删除后(例如若mysql容器出现了问题，需要被删除，容器删除了，容器中的资源也删除了)，在容器中产生的数据不在了
- 实现：
  - 连接数据卷，将容器的文件系统的路径**映射**到linux虚拟机的文件系统中，实现数据的持久化和同步操作（类似于双向绑定）
    - 好处：
      - 方便nginx在外部修改配置文件
### 数据卷实现容器和外部机器交换文件
- Docker 容器和外部机器不能直接交换文件，要通过数据卷这一**桥梁**进行**间接交换**
![20230524210905](https://blog-image-9943.oss-cn-beijing.aliyuncs.com/20230524210905.png)
###  数据卷实现容器之间的数据交互
- 数据卷和多个容器进行绑定
### 数据卷
- 数据卷是宿主机中的一个目录或文件
- 当容器目录和数据卷目录绑定后，对方的修改会立即同步
- 一个数据卷可以被多个容器同时挂载
- 一个容器也可以被挂载多个数据卷
### 配置数据卷
- 创建启动容器时，使用–v（volumn） 参数设置数据卷
  - `docker run -it –v 宿主机(linux虚拟机)目录(文件):容器内目录(文件) ...`
  - 查看容器详细信息：`docker inspect 容器id`
    - 查看 Mounts数组
      - type：bind为绑定类型
      - source：主机的文件地址
      - destination：docker容器的文件地址
  - 注意
    - 目录必须是绝对路径(/而不是./)
    - 如果目录不存在，会自动创建
    - 可以挂载多个数据卷
### 数据卷容器
- 是个容器，用来共享数据
- 用于实现多容器进行数据交换
  - 方式一
    - 可以让这两个容器挂载同一个数据卷，但是当容器多了后，操作较麻烦。
  - 方式二：数据卷容器
