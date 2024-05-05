---
title: Docker部署Nginx
article: true
category:
  - 中间件
  - Docker
  - Nginx
---
## Docker部署Nginx
### 1. 镜像
`docker pull nginx`
`docker images nginx`
### 2. 创建临时容器
- 创建临时容器，用于复制配置文件，挂载数据卷
`docker run -d -p 80:80 --name tempNginx [nginxImageId]`
- 进入容器，查看数据卷挂载地址
`docker exec -it [dockerId] bash`
### 3. 挂载数据卷
1. 查看nginx欢迎页面，无误后挂载数据卷
2. 查看那些文件需要挂载`docker exec -it [nginxImageId] bash`
3. exit
3. 创建数据卷挂载目录
```bash
mkdir -p /opt/docker/nginx/{conf,html,log,ssl}
```
4. 复制数据卷资源
```bash
docker cp tempNginx:/etc/nginx/conf.d  /opt/docker/nginx/conf/
docker cp tempNginx:/etc/nginx/nginx.conf /opt/docker/nginx/conf/nginx.conf
docker cp tempNginx:/usr/share/nginx/html/index.html /opt/docker/nginx/html/index.html
```
### 4. 删除临时容器
`docker stop tempNginx`
`docker rm tempNginx`
或
`docker rm -f tempNginx`
### 5. 创建真正的容器
```bash
docker run \
-p 80:80 \
--name nginx \
--restart=always \
-v /opt/docker/nginx/conf/nginx.conf:/etc/nginx/nginx.conf \
-v /opt/docker/nginx/conf/cert:/etc/nginx/cert \
-v /opt/docker/nginx/ssl:/etc/nginx/ssl/  \
-v /opt/docker/nginx/conf/conf.d:/etc/nginx/conf.d \
-v /opt/docker/nginx/log:/var/log/nginx \
-v /opt/docker/nginx/html:/usr/share/nginx/html \
-d nginx
```
### 6. 验证
1. `ip:80`
2. `docker logs [dockerId]`
### 7. 更新nginx配置
1. `docker exec [dockerId] nginx -t`
2. `docker exec [dockerId] nginx -s reload` 



