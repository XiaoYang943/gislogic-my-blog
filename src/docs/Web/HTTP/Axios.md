---
title: axios
article: false
category:
  - HTTP
---

## axios
### axios是什么
1. axios是一个AJAX请求库，通过axios向服务器发送AJAX请求
2. 可以在node.js中运行，向服务器发送HTTP请求
### axios的作用
1. 在浏览器端向服务器发送AJAX请求
2. 在node.js中向服务器发送HTTP请求
3. 支持Promise API
4. 请求、响应拦截器
5. 对请求和响应数据做转换
6. 取消请求
7. 自动将结果转换为JSON数据

## 响应结果的结构
1. config属性（配置对象）
   - 属性值：包括请求类型、url、请求体等。
2. data属性
   - 属性值：响应体，axios自动将服务器返回的结果进行JSON解析，转换成了对象，方便对结果进行处理
3. headers属性
   - 属性值：响应头
4. request属性
   - 属性值：原生的AJAX请求对象
5. status、statusText属性
   - 属性值：响应状态码、响应状态字符串

### 请求的配置对象
1. <font color=red>url</font>：指明请求给谁发送
2. <font color=red>method</font>：设置请求类型
3. <font color=red>baseURL</font>：设定URL的基础结构，即baseURL是多个url相同的部分，axios会将baseURL和url进行结合
4. transformRequest：对请求的数据做处理，再将处理后的结果向服务器发送
5. transformResponse：对响应的数据做处理
6. <font color=red>headers</font>：请求头信息，常用于身份校验，要求在头信息中加入特殊的表示，检验请求是否满足条件
7. <font color=red>params</font>：将URL分解设置
8. paramsSerializer：对请求的参数进行序列化，转化为字符串
9. <font color=red>data</font>:请求体设置，一种是对象形式，一种是字符串形式
10. <font color=red>timeout</font>:超时时间，发送请求时如果超过这个时间，请求就会取消，单位：毫秒
11. withCredentials：跨域请求时对Cookie的携带做设置（true为携带）
12. adapter：对请求的适配器做设置


## 拦截器
### 请求拦截器
- 在发送请求时，请求拦截器函数对请求参数和内容进行处理和检测，若没问题，则发送请求，若有问题，则取消请求
### 响应拦截器
- 当服务器返回结果时，响应拦截器函数先对结果进行预处理
## 取消请求
- cancelToken

