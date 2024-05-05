---
title: Docker-概述
article: false
category:
  - 中间件
  - Docker
---
## Docker
### 作用
- Docker 可以让开发者打包他们的应用以及依赖包到一个轻量级、可移植的容器中，然后发布到任何流行的Linux 机器上。
- 规避环境不同导致的bug
- 方便管理服务器上的软件
### 架构
1. Clients: 客户端
2. Hosts：Docker核心
    - local host：本机，虚拟机上安装了docker之后，docker以daemon守护进程(后台进程)的方式存在
    - remote host： 远程机器
3. Registries: 仓库：代码控制中心，保存许多镜像文件
    - 官方提供的仓库(中央仓库)，但是网速慢
    - 私有的仓库，较快



