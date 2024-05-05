---
title: Docker-命令
article: false
category:
  - 中间件
  - Docker
---
## Docker命令
### 进程命令
- 用来操作docker
- 启动docker服务:
  - `systemctl start docker`
- 停止docker服务:
  - `systemctl stop docker`
- 重启docker服务:
  - `systemctl restart docker`
- 查看docker服务状态:
  - `systemctl status docker`
- 设置开机启动docker服务:
  - `systemctl enable docker`
### 镜像命令
- 查看镜像：查看本地有哪些镜像文件
  - `docker images`
  - `docker images –q`：查看所用镜像的id
- 搜索镜像：搜索仓库中有哪些镜像文件
  - `docker search 镜像名称`
- 拉取镜像：下载镜像
  - `docker pull redis:5.0`
    - 不写版本号，则默认下载最新版latest
    - [找软件的版本号](hub.docker.com)
- 删除镜像:删除本地镜像文件
  - `docker rmi + 镜像id`
  - 删除所有镜像:docker rmi `docker images -q`
### 容器命令
- 查看容器
  - `docker ps`查看正在运行的容器
  - `docker ps –a`查看所有容器
- 创建容器：通过镜像，创建出可以运行的实例(容器)，当容器创建好，会自动运行一个相应的软件。
  - 创建并启动容器:`docker run 参数`
    - 参数
      - -i：保持容器运行。通常与-t 同时使用。加入it这两个参数后，容器创建后自动进入容器中，退出容器后，容器自动关闭。
      - -t：为容器重新分配一个伪输入终端（终端：可以输入一些命令），通常与-i 同时使用。
      - -d：以守护（后台）模式运行容器。创建一个容器在后台运行，需要使用docker exec 进入容器。退出后，容器不会关闭。
      - -it 创建的容器一般称为交互式容器，-id 创建的容器一般称为守护式容器
      - --name：为创建的容器命名。（--name=myname）
  - 举例
    - 根据redis5.0镜像创建名为myredis的实例：`docker run -it --name=myredis redis:5.0`
      - 当终端root后用户名发生变化后，改为了容器的id，表示已经进入了刚才创建的容器内部
      - 用-it创建的容器，当exit后，该容器会关闭。创建后会立刻进入该容器
    - `docker run -id`
      - d表示后台运行创建容器，创建好后不会立即进入容器，需要用命令进入容器。`exit`后，该容器不会关闭
- 进入容器
  - `docker exec -it 容器id bash`
- 启动容器
  - `docker start 容器名称`
- 重启容器
  - `docker restart 容器id`
- 停止容器
  - `docker stop 容器名称`  停止容器之前要exit退出容器
- 退出容器
  - 返回到linux宿主机:`exit`
- 删除容器
  - `docker rm 容器名称`,如果容器是运行状态则删除失败，需要停止容器才能删除
- 查看容器信息
  - 查看目前运行的容器:`docker ps` 
  - 查看关闭和运行的所有容乃公器:`docker ps -a`
  - 查看容器信息:`docker inspect 容器id`
