---
title: SpringMVC
article: false
category:
  - Java
  - SpringMVC
---
## MVC
### 基础概念
#### MVC
1. MVC是一种软件架构的思想，将软件按照**模型、视图、控制器**来划分
   - Model，模型层，指工程中的JavaBean，作用是处理数据
     - JavaBean分为两类：
       - 一类称为**实体类Bean**：专门**存储业务数据**的，如Student、User等
       - 一类称为**业务处理Bean**：指**Service或Dao**对象，专门用于**处理业务逻辑和数据访问**。
    - View，视图层，指工程中的**html或jsp**等页面，作用是**与用户进行交互，展示数据**
    - Controller，控制层，指工程中的**servlet**，作用是**接收请求和响应浏览器**
2. MVC的工作流程
用户通过视图层发送请求到服务器，在服务器中请求被Controller接收，Controller调用相应的Model层处理请求，处理完毕将结果返回到Controller，Controller再根据请求处理的结果找到相应的View视图，渲染数据后最终响应给浏览器
#### SpringMVC
1. SpringMVC是Spring的一个子模块，目前是Java EE项目表述层开发的**首选方案**。
    - 注：三层架构分为表述层（或表示层）、业务逻辑层、数据访问层，表述层表示前台页面和后台servlet
2. 特点
- **Spring 家族原生产品**，与 IOC 容器等基础设施无缝对接
- **基于原生的Servlet**，通过了功能强大的**前端控制器DispatcherServlet**，对请求和响应进行统一处理
- 表述层各细分领域需要解决的问题**全方位覆盖**，提供**全面解决方案**
- **代码清新简洁**，大幅度提升开发效率
- 内部组件化程度高，可插拔式组件**即插即用**，想要什么功能配置相应组件即可
- **性能卓著**，尤其适合现代大型、超大型互联网项目要求
### 拦截器
- 拦截控制器方法的执行
- 通过`HandlerInterceptor`接口实现
  - 三个重要的实现类
    - `preHandle`:控制器方法执行之前执行
      - 其boolean类型的返回值表示拦截或放行
        - 返回true为放行，即调用控制器方法进行视图渲染
        - 返回false表示拦截，即不调用控制器方法
    - `postHandle`:控制器方法执行之后执行
    - `afterCompletion`:处理完视图和模型数据，渲染视图完毕之后执行
- 多个拦截器的执行顺序
  - 若每个拦截器的`preHandle`都返回true
    - 此时多个拦截器的执行顺序和拦截器在SpringMVC的配置文件的配置顺序有关
      - `preHandle`会按照配置的顺序执行，而`postHandle`和`afterComplation`会按照配置的反序执行
  - 若某个拦截器的preHandle()返回了false
    - `preHandle`返回false和它之前的拦截器的`preHandle`都会执行，`postHandle`都不执行，返回false的拦截器之前的拦截器的`afterComplation`会执行
#### 应用
- 可以添加多个拦截器来完成不同的功能
  - 验证Token
  - 获取权限
  - 防止重复提交