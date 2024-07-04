---
title: Github-Actions工作流
article: true
category:
  - CI/CD
---
## Github-Actions工作流
### 1. 给GitHub-Actions配置云服务器私钥
1. 云服务器生成秘钥
   - cd`/root/.ssh`
   - 执行`ssh-keygen`生成秘钥，给私钥设置强密码(重要)
     - id_rsa  生成的私钥 
     - id_rsa.pub  生成的公钥
2. 给GitHub-Actions配置云服务器私钥
   - github仓库地址->settings->secrets->actions->new repository secret
   - cat生成的私钥并配置
### 2. 给云服务器配置公钥
- 执行`cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys`，将公钥内容追加填写到`authorized_keys`中
- 权限检查
  - chmod 600 authorized_keys 
  - chmod 700 ~/.ssh

### 3. 配置Nginx(省略...)
### 4. 配置工作流
1. 项目的根目录下创建`.github/workflows/deploy.yml`并配置相关信息
- [参考](https://github.com/actions/checkout)
```yml
name: Deploy My Blog

on:
  push:
    branches:
      - master

jobs:
  deploy:
    runs-on: ubuntu-latest # 使用ubuntu系统镜像运行自动化脚本

    steps: # 自动化步骤
      #下载代码仓库
      - uses: actions/checkout@v1

      # 使用action库，安装node
      - name: use Node.js # 使用action库  actions/setup-node安装node
        uses: actions/setup-node@v1
        with:
          node-version: 18.20.2 # 指定node版本
      # 安装依赖
      - name: npm install
        run: npm install

      #打包项目
      - name: Build
        run: npm run docs:build

      #部署到服务器
      - name: Deploy
        uses: easingthemes/ssh-deploy@v2.1.6
        env:
          #私钥
          SSH_PRIVATE_KEY: ${{ secrets.ACTIONSKEY }} # GitHub配置的私钥名称
          ARGS: "-rltgoDzvO"
          SOURCE: "docs/.vuepress/dist"
          REMOTE_HOST: ${{ secrets.IP }} #服务器ip
          REMOTE_USER: ${{ secrets.USER }} #服务器用户
          TARGET: "/opt/docker/nginx/html/blog" #部署路径
          EXCLUDE: "/node_modules/"
```
2. 推送本地的 `deploy.yml` 到远程 GitHub 源码库，查看最后 Actions 执行效果即可
