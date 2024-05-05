---
title: Docker-安装和部署
article: false
category:
  - 中间件
  - Docker
---
## 安装docker
- [ubuntu安装docker](https://www.runoob.com/docker/ubuntu-docker-install.html)
- `curl -fsSL https://test.docker.com -o test-docker.sh`
- `sudo sh test-docker.sh`
- `whereis docker`
## portainer
- [portainer官网](https://www.portainer.io/)
### ubuntu安装portainer
- [参考文章](https://www.cnblogs.com/lcword/p/17306248.html)
  - 首先创建数据卷，实现数据持久化`docker volume create portainer_db`
  - 启动portainer容器`docker run -d -p 9000:9000 --name portainer --restart always -v /var/run/docker.sock:/var/run/docker.sock -v portainer_db:/data portainer/portainer`
  - 若使用阿里云ecs，则需要在安全组开放9000端口
  - 测试`ip:9000`
  - 若遇到以下问题，需要重启portainer`docker restart portainer`
![20230524232419](https://blog-image-9943.oss-cn-beijing.aliyuncs.com/20230524232419.png)

## 端口映射
- 容器有隔离性
- 公网访问nginx容器流程：(使用阿里云服务器)
  - 外网访问阿里云安全组开放的9999端口，访问到linux防火墙的9999端口
  - 使用命令-p暴露容器端口：`-p 9999:80`,这样才能用公网访问到80端口的nginx容器
### portainer部署nginx
- images，拉取nginx镜像
- containers，创建nginx容器
- nginx容器中，duplicate/edit,publish a new network port,配置端口映射，例如80和80，然后部署容器。![20230524234706](https://blog-image-9943.oss-cn-beijing.aliyuncs.com/20230524234706.png)
- 测试![20230524234728](https://blog-image-9943.oss-cn-beijing.aliyuncs.com/20230524234728.png)
- 修改配置文件
  - 先进入容器`docker exec -it nginx-test bash`
  - 找安装目录`whereis nginx`
  - 查看配置文件`cd /etc/nginx`，`cat nginx.conf`
## Docker部署nginx
- 查看容器信息`docker inspect 容器id`
  - /usr/sbin/nginx: nginx启动项的位置
  - /usr/lib/nginx： nginx包的位置
  - /etc/nginx： nginx配置文件的位置
  - /usr/share/nginx： nginx存放项目的位置

- 重新加载nginx配置文件
  - 方式一：重启容器
  - 方式二：
    - docker exec 容器id nginx -t 
    - docker exec 容器id  nginx -s reload 

- [参考文章](https://www.cnblogs.com/cy-e/p/15359852.html)
