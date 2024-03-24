---
title: Nginx
article: false
category:
  - 中间件
  - Nginx
---

## 反向代理
### 发现问题
- 当用户量少时，并发量小，在服务器上配置一个Tomcat够用了
- 用户量慢慢增加，当并发量大时，一台服务器满足不了需求，需要多配置几台服务器，Tomcat跑在多台服务器上
- 此时，出现问题：
  - 一个用户访问服务器，到底要访问哪个服务器？
  - Session不共享，在A服务器上登陆后，若又请求了B服务器，则**退出登陆**了
### 解决问题
- 此时，需要中间件nginx作为**代理服务器**，来解决这个问题
- 客户端先访问nginx（总服务器、代理服务器），nginx能**把请求代理到其他的几台服务器**上，完成**服务的请求转发**(反向代理)
- 反向代理，被代理的是服务器
![20230412162901](https://blog-image-9943.oss-cn-beijing.aliyuncs.com/20230412162901.png)
### 正向代理
- 正向代理,被代理的是客户端
![20230412162815](https://blog-image-9943.oss-cn-beijing.aliyuncs.com/20230412162815.png)
## 负载均衡
### 发现问题
- 每个服务器的性能、内存大小可能不同，如何**控制将更多的请求代理到性能高的服务器上**
### 解决问题
- nginx给服务器配置加权轮询，实现负载均衡
### 负载均衡的策略
- 轮询，权重相同，将请求轮询地分发到服务器上
- 加权轮询，权重越高的服务器，会被分发越多的请求，保证服务器的性能最佳
- iphash:不能做到session共享
  - 解决方法：使用redis，或nginx的iphash策略，实现session共享
## 动静分离
- 静态资源每次从jar包中加载会比较麻烦，用nginx将静态资源的请求转发到专门处理静态资源的服务器，动态服务请求走web服务器
## 环境配置
### 安装nginx
- 推荐安装稳定版stable,windows的是windows，没写windows的是linus的
#### windows
- nginx.exe启动文件
- conf：配置文件
  - 重点是nignx.conf配置文件
#### linus
- 打开xshell，连接服务器，输入nginx、whereis nginx查看是否已经有nginx
- 解压，安装好后，去sbin，启动nginx，默认监听80，访问服务器地址，看到nginx欢迎页。若用阿里云等平台，要把安全组的80端口也放开。
  - 注意：改了配置文件后想要生效，要reload
### nginx.conf配置文件
- server-listen:80（默认是80）,若访问80端口，则会被nginx拦截
  - 测试：先启动，再访问localhost:80,看到nginx的欢迎页，则表示nginx启动成功
## 常用命令
- `nginx`：启动Nginx服务器。
- `nginx -s stop`：停止正在运行的Nginx服务器。
- `nginx -s quit`：优雅地停止Nginx服务器。
- `nginx -s reload`：重新加载Nginx配置文件，无需停止服务器。
- `nginx -t`：检查Nginx配置文件的语法是否正确、查看配置文件 nginx.conf 路径
- `nginx -V`：显示Nginx版本和编译选项信息。
- `nginx -h`：显示Nginx的命令行选项。
- `sudo systemctl start nginx`：在Linux上使用systemd启动Nginx。
- `sudo systemctl stop nginx`：在Linux上使用systemd停止Nginx。
- `sudo systemctl restart nginx`：在Linux上使用systemd重新启动Nginx。
- ` ps -ef | grep nginx`：查看nginx安装目录
- `ps -ef  | grep nginx`:查看进程
- `kill -QUIT 23423`：杀死进程
- `whereis nginx`： 查询nginx安装目录
## 参考文章
[阿里云服务器nginx部署](https://www.arryblog.com/guide/deploy/alibaba-cloud-deployment.html)
[阿里云服务器安装nginx](https://blog.51cto.com/lichuachua/5428200)
[nginx配置模板](https://zhuanlan.zhihu.com/p/619165119)
[部署](https://blog.csdn.net/qq_44785351/article/details/127786615)
[部署(安装nginx最简单)](https://blog.csdn.net/z2823930772/article/details/125726873)
[nginx通用配置文件](https://www.runoob.com/w3cnote/nginx-install-and-config.html)
[nginx开机自启](https://www.freesion.com/article/57101542624/)
[嘻嘻](https://blog.csdn.net/fcclzydouble/article/details/123499440)
[???](https://blog.51cto.com/wjw1014/5411461)
## 安装前置环境
- 阿里云ubuntu
  - [安装pcre](https://blog.csdn.net/changyana/article/details/123453329)
## 卸载nginx
- `find / -name nginx`查找根下所有名字包含nginx的文件
- `rm -rf`
- `whereis nginx`
- 若设置了开机自启
  - 
## 报错
- [nginx: [error] invalid PID number "" in "/run/nginx.pid"](https://blog.csdn.net/SongJingzhou/article/details/102967218)
- [端口占用](https://blog.csdn.net/a15608445683/article/details/122454938)

## 配置同一域名同一端口下部署多个vue项目
- 子项目router-index.js
```js
import { createRouter, createWebHistory } from "vue-router";
const routerHistory = createWebHistory();
const router = createRouter({
    history: routerHistory,
    base: "/demo/",   // 重点
});
 
export default router;
```
- 子项目vite.config.js
```js
export default defineConfig({
  plugins: [vue()],
  base: '/demo/',   // 重点
})
```
- nginx-default.conf
```conf
server {
    listen       80;
    server_name  gisyang.xyz;


    #主项目
    location / {
        root   /usr/share/nginx/html/blog;
        index  index.html index.htm;
    }

  #子项目，重点
  location /demo {
        alias   /usr/share/nginx/html/demo;
        index  index.html index.htm;
    }
}
```
## vue-router和nginx冲突问题
- vue页面路由和nginx的location冲突问题：
```js
const routes = [
    {
        path: '/demo',
        component: () => import('../components/CesiumDemo/CesiumDemoLayout.vue')
    },
    {
        path: '/demo/detail',   // 重点
        component: () => import('../components/CesiumDemo/CesiumDemoMain.vue')
    },
]
```
```js
import { useRouter } from 'vue-router'
const router = useRouter()
const url = router.resolve({
    path: '/demo/detail',   // 重点
});
window.open(url.href);
```

```conf
 location /demo {
    alias   /usr/share/nginx/html/demo;
    index  index.html index.htm;
    try_files $uri $uri/ /demo/index.html;   // 重点，rewrite ，将 URL 重写为 index.html
}
```
## vue静态资源路径和nginx冲突问题
- vue，用axios请求本地public下的静态资源，与nginx的路径冲突问题
- 例如，请求public下的examples下的html文件
![20230614002455](https://blog-image-9943.oss-cn-beijing.aliyuncs.com/20230614002455.png)
![20230614002228](https://blog-image-9943.oss-cn-beijing.aliyuncs.com/20230614002228.png)
- 解决：需要给nginx再配置一个location
![20230614002428](https://blog-image-9943.oss-cn-beijing.aliyuncs.com/20230614002428.png)
```conf
location /examples {
    alias   /usr/share/nginx/html/demo/examples;
    index  index.html index.htm;
}
```