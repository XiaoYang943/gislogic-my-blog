---
title: Redis
article: false
category:
  - RuoYI
---
## Redis的初始数据
- 后台启动时，向redis中存储数据
![20230412231002](https://blog-image-9943.oss-cn-beijing.aliyuncs.com/20230412231002.png)
- redis缓存中，存储了字典、开关配置等常用数据，这些数据不会经常改动
![20230412232046](https://blog-image-9943.oss-cn-beijing.aliyuncs.com/20230412232046.png)
- 拿这些数据时，会先从redis缓存中拿，若没有再去数据库中查，减轻了数据库IO压力
![20230412232418](https://blog-image-9943.oss-cn-beijing.aliyuncs.com/20230412232418.png)
- 改这些数据时，数据库和redis缓存中会同步改变，先改数据库，成功后回填redis
![20230412233022](https://blog-image-9943.oss-cn-beijing.aliyuncs.com/20230412233022.png)
![20230412234135](https://blog-image-9943.oss-cn-beijing.aliyuncs.com/20230412234135.png)

- [redis密码报错](https://blog.csdn.net/u014026084/article/details/105767907)