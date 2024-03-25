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
### 3. 挂载数据卷
1. 查看nginx欢迎页面，无误后挂载数据卷
2. 查看那些文件需要挂载`docker exec -it [nginxImageId] bash`
3. 创建数据卷挂载目录`mkdir -p /opt/docker/nginx/{config,html,logs}`
4. 挂载数据卷 
   - 由于挂载的是目录，而不是文件，所以为了方便直接把/ect/nginx全部挂载出去
```bash
sudo docker cp tempNginx:/usr/share/nginx/html/. /opt/docker/nginx/html
sudo docker cp tempNginx:/etc/nginx/. /opt/docker/nginx/config
sudo docker cp tempNginx:/var/log/nginx/. /opt/docker/nginx/logs
```
### 4. 删除临时容器
`docker stop tempNginx`
`docker rm tempNginx`
### 5. 创建真正的容器
```bash
# 参考:
docker run
-d 
-p 80:80
--name nginx01 
-v /opt/docker/nginx/html:/usr/share/nginx/html 
-v /opt/docker/nginx/config:/etc/nginx
-v /opt/docker/nginx/logs:/var/log/nginx
[nginxImageId]
```
- 使用如下命令创建并运行nginx容器：
`docker run -d -p 80:80 --name nginx01 -v /opt/docker/nginx/html:/usr/share/nginx/html -v /opt/docker/nginx/config:/etc/nginx -v /opt/docker/nginx/logs:/var/log/nginx [nginxImageId]`
### 6. 验证
1. `ip:80`
2. `docker logs [dockerId]`
### 7. 更新nginx配置
1. `docker exec [dockerId] nginx -t`
2. `docker exec [dockerId] nginx -s reload` 
