---
title: JavaWeb
article: false
category:
  - Java
  - JavaWeb
---
## JavaWeb
- 所有通过Java语言编写可以通过浏览器访问的程序的总称，叫 JavaWeb。
### JavaWeb三大组件
#### Servlet程序
#### Filter过滤器
#### Listener监听器
### JavaWeb 是基于请求和响应来开发的。
- 请求是指客户端给服务器发送数据，叫请求 Request。
- 响应是指服务器给客户端回传数据，叫响应 Response。
- 请求和响应是成对出现的，有请求就有响应。

- 每次只要有请求进入Tomcat 服务器，Tomcat 服务器就会把请求过来的HTTP 协议信息解析好封装到Request 对象中。
然后传递到service 方法（doGet 和doPost）中给我们使用。我们可以通过HttpServletRequest 对象，获取到所有请求的
信息。
## Tomcat服务器
- 由 Apache 组织提供的一种 Web 服务器，提供对 jsp 和 Servlet 的支持。它是一种轻量级的 javaWeb 容器（服务器），也是当前应用最广的 JavaWeb 服务器（免费）。
- 启动Tomcat：win+r-startup.bat
- 目录介绍
- bin-专门用来存放 Tomcat 服务器的可执行程序
- conf-专门用来存放 Tocmat 服务器的配置文件
- lib-专门用来存放 Tomcat 服务器的 jar 包
- logs-专门用来存放 Tomcat 服务器运行时输出的日记信息
- temp-专门用来存放 Tomcdat 运行时产生的临时数据
- webapps-专门用来存放部署的 Web 工程。
- work-是 Tomcat 工作时的目录，用来存放 Tomcat 运行时 jsp 翻译为 Servlet 的源码，和 Session 钝化的目录。
- 改Tomcat 的端口号：
    Tomcat-conf-server.xml-Connector标签-重启Tomcat
- 访问Tomcat下的web工程：将web工程放到tomcat-webapp-浏览器输入地址/工程文件夹名称
### idea配置tomcat
File-Settings-Build, Execution, Deployment-Application Servers
检查是否配置成功file-new-module-java enterprise-application server
### idea配置动态工程

file-new-module-java enterprise-勾选web application
- 目录介绍：
webTest
    src     java代码
    web     web工程的资源文件:js、html、css
        WEB-INF     是受服务器保护的文件夹，浏览器无法直接访问到此目录内容
            lib     存放jar包
            web.xml     整个动态web工程的配置部署文件，比如servlet、filter、listener、session...
        index.jsp
    webTest.iml
## servlet
### 手动配置servlet
1. web-WEB-INF-web.xml
```xml
<!-- 以下两步配置servlet
        配置好后启动，会在浏览器看到index.jsp页面
            地址栏中输入/hello,找到对应的servlet程序
                找到该程序对应的类
                    找到类对应的service方法并执行
-->
<!-- 1. 给Tomcat配置servlet程序 -->
<servlet>
    <!-- 给servlet程序起别名(一般是类名) -->
    <servlet-name>HelloServlet</servlet-name>
    <!-- 是servlet程序的全类名 -->
    <servlet-class>com.hyy.servlet.HelloServelet</servlet-class>
</servlet>

<!-- 2. 给servlet程序配置访问地址 -->
<servlet-mapping>
    <!-- 告诉服务器，当前配置的地址是给哪个servlet程序使用 -->
    <servlet-name>HelloServlet</servlet-name>
    <!-- 配置访问地址
        斜杠在服务器解析的时候，表示地址为http://ip:port/工程路径
            工程路径:运行-编辑配置-Deployment-Application Context
                Tomcat下的WebApp文件夹中是多个工程
    -->
    <!-- 该路径是资源路径最好和该servlet程序别名有映射关系，否则容易搞混-->
    <url-pattern>/hello</url-pattern>
</servlet-mapping>
```

```java
public class HelloServelet implements Servlet {
    // 导入Servlet包后，Alt+insert-实现方法
    @Override
    public void init(ServletConfig servletConfig) throws ServletException {
    }

    @Override
    public ServletConfig getServletConfig() {
        return null;
    }
    
    /**
     * @Description service方法是专门用来处理请求和响应的,当servlert程序启动后，service方法会自动执行
     * @Param
     * @return 
     * @Author hyy
     * @Date 12:59 2022/7/23
     **/
    @Override
    public void service(ServletRequest servletRequest, ServletResponse servletResponse) throws ServletException, IOException {
        System.out.println("Hello Servlet被访问了");
    }

    @Override
    public String getServletInfo() {
        return null;
    }

    @Override
    public void destroy() {
    }

    public HelloServelet() {
    }
}
```
3. 优化
   - 新建一个类去继承HttpServlet类
   - 根据业务需要重写doGet、doPost方法
   - 配置web.xml
```java
public class ExtendHttpServlet extends HttpServlet {
    // 选择重写的方法，然后在web.xml中配置
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

    }
}

```
:::tip
配置好servlet后，为什么在地址栏键入资源路径便能自动执行对应的servlet程序下的service方法
http://localhost:8080/xxx/yyy
- http:// 协议
- localhost 服务器ip，通过ip地址定位服务器
- :8080 服务器端口号，通过端口号定位Tomcat
- /xxx  工程路径，通过工程路径确定访问哪个工程
- /yyy  资源路径，通过资源路径找到xml中的servlet-name，再根据servlet-name找到servlet-class中的类，最后找到了**service方法**并执行
:::

### idea自动配置servlet
new-Create New Servlet(注意:取消勾选Java EE6)-xml中配置servlet-mapping即可
### servlet的生命周期
1. 执行servlet构造器方法
   - 第一次访问创建servlet程序时调用
2. 执行init初始化方法
   - 第一次访问创建servlet程序时调用
3. 执行service方法
   - 每次访问都会调用
4. 执行destory方法
   - web工程停止时调用
### service方法中对get和post请求做分发处理
```java
@Override
public void service(ServletRequest servletRequest, ServletResponse servletResponse) throws ServletException, IOException {
    // 获得请求类型并做类型转换（因为它有 getMethod()方法）
    HttpServletRequest httpServletRequest = (HttpServletRequest) servletRequest;
    String method = httpServletRequest.getMethod();
    // 但是当请求方法体太长时，显得比较臃肿，所以把请求执行的方法封装
    if("GET".equals(method)) {
        doGet();
    } else if("POST".equals(method)) {
        doPost();
    }
}

public void doGet(){
    System.out.println("GET请求执行了");
}

public void doPost(){
    System.out.println("POST请求执行了");
}
```
### ServletConfig类
```java
@Override
public void init(ServletConfig servletConfig) throws ServletException {
    // 获取Servlet程序的别名servlet-name
    System.out.println("HelloServlet程序的别名是:" + servletConfig.getServletName());

    // 获取Servlet程序初始化参数(首先要在web.xml中配置<init-param>)
    System.out.println("初始化参数url的值:" + servletConfig.getInitParameter("url"));

    // 获取ServletContexrt对象
    System.out.println("ServletContexrt对象:" + servletConfig.getServletContext());
}
```
```xml

<servlet>
    <servlet-name>HelloServlet</servlet-name>
    <servlet-class>com.hyy.servlet.HelloServelet</servlet-class>

    <!-- 初始化参数 -->
    <init-param>
        <param-name>username</param-name>
        <param-value>root</param-value>
    </init-param>
    <init-param>
        <param-name>url</param-name>
        <param-value>jdbc:mysql://localhost:3306/test</param-value>
    </init-param>
</servlet>
```
### ServletContext类
1. ServletContext 是一个接口，它表示 Servlet 上下文对象
2. 一个 web 工程，**只有一个** ServletContext 对象实例。
3. ServletContext 对象是一个域对象。
   - 域对象，是可以像 Map 一样存取数据的对象，叫域对象。这里的域指的是存取数据的操作范围，整个 web 工程。
   - 存对象：`域对象.setAttribute()`
   - 取对象：`域对象.getAttribute()`
4. ServletContext 是在 web 工程部署启动的时候创建。在 web 工程停止的时候销毁。
5. 作用
```xml
 <!-- context-param 要配置在servlet上面,是上下文参数，属于整个web工程 -->
<context-param>
    <param-name>key</param-name>
    <param-value>value</param-value>
</context-param>
```
- **斜杠映射到IDEA代码的web目录**
```java
protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    // 获取 web.xml 中配置的上下文参数 context-param,写法二:ServletContext servletContext = getServletContext();
    ServletContext context = getServletConfig().getServletContext();

    String key = context.getInitParameter("key");
    System.out.println("context-param参数key的值是:" + key);
    // 2、获取当前的工程路径，格式: /工程路径
    System.out.println("当前工程路径:" + context.getContextPath());
    // 获取工程部署后在服务器硬盘上的绝对路径
    // 斜杠在服务器解析的时候，表示地址为http://ip:port/工程路径,斜杠映射到IDEA代码的web目录
    System.out.println("工程部署的路径:" + context.getRealPath("/"));
    // 像 Map 一样存取数据
    context.setAttribute("key1","value1");
    System.out.println("context中获取域数据key1的值是:" + context.getAttribute("key1"));
}
```
### HttpServletRequest类
- 每次只要有请求进入 Tomcat 服务器，Tomcat 服务器就会把请求过来的 HTTP 协议信息解析好封装到 Request 对象中。 然后传递到 service 方法（doGet 和 doPost）中给我们使用。我们可以通过 HttpServletRequest 对象，获取到所有请求的 信息。
- getRequestURI() 获取请求的资源路径 
- getRequestURL() 获取请求的统一资源定位符（绝对路径） 
- getRemoteHost() 获取客户端的 ip 地址 
- getHeader() 获取请求头 
- getParameter() 获取请求的参数 
- getParameterValues() 获取请求的参数（多个值的时候使用） 
- getMethod() 获取请求的方式 GET 或 POST 
- setAttribute(key, value); 设置域数据 
- getAttribute(key); 获取域数据 
- getRequestDispatcher() 获取请求转发对象
```java
public class RequestAPIServlet extends HttpServlet { 
    @Override protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException { 
        // getRequestURI() 获取请求的资源路径 
        System.out.println("URI => " + req.getRequestURI()); 
        // getRequestURL() 获取请求的统一资源定位符(绝对定位)
        System.out.println("URL => " + req.getRequestURL()); 
        // getRemoteHost() 获取客户端的 ip 地址 
        /*** 在 IDEA 中，使用 localhost 访问时，得到的客户端 ip 地址是 ===>>> 127.0.0.1
        * 在 IDEA 中，使用 127.0.0.1 访问时，得到的客户端 ip 地址是 ===>>> 127.0.0.1
        在 IDEA 中，使用 真实 ip 访问时，得到的客户端 ip 地址是 ===>>> 真实的客户端 ip 地址
        */ 
        System.out.println("客户端 ip 地址 => " + req.getRemoteHost()); 
        // getHeader() 获取请求头 
        System.out.println("请求头 User-Agent ==>> " + req.getHeader("User-Agent")); 
        // getMethod() 获取请求的方式 GET 或 POST 
        System.out.println( "请求的方式 ==>> " + req.getMethod() ); 
     } 
}
```
#### 获取表单的请求参数
```html
<body> 
    <form action="http://localhost:8080/07_servlet/parameterServlet" method="get"> 
        用户名：<input type="text" name="username"><br/> 
        密码：<input type="password" name="password"><br/> 
        兴趣爱好：<input type="checkbox" name="hobby" value="cpp">C++ 
        <input type="checkbox" name="hobby" value="java">Java 
        <input type="checkbox" name="hobby" value="js">JavaScript<br/> 
        <input type="submit"> 
    </form> 
</body>
```
```java
public class ParameterServlet extends HttpServlet { 
    @Override 
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException { 
        // 获取请求参数 
        String username = req.getParameter("username"); 
        String password = req.getParameter("password"); 
        String[] hobby = req.getParameterValues("hobby"); 
        System.out.println("用户名：" + username); 
        System.out.println("密码：" + password); 
        System.out.println("兴趣爱好：" + Arrays.asList(hobby));
    }
}
```
#### 解决乱码
- doGet
```java
// 获取请求参数 
String username = req.getParameter("username"); 
//1 先以 iso8859-1 进行编码 
//2 再以 utf-8 进行解码 
username = new String(username.getBytes("iso-8859-1"), "UTF-8");
```
- doPost
```java
@Override 
protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException { 
    // 设置请求体的字符集为 UTF-8，从而解决 post 请求的中文乱码问题 
    req.setCharacterEncoding("UTF-8"); 
    System.out.println("-------------doPost------------"); 
    // 获取请求参数 
    String username = req.getParameter("username"); 
    String password = req.getParameter("password"); 
    String[] hobby = req.getParameterValues("hobby"); 
    System.out.println("用户名：" + username); 
    System.out.println("密码：" + password); 
    System.out.println("兴趣爱好：" + Arrays.asList(hobby)); 
}
```
#### 请求的转发
1. 服务器收到请求后，从一次资源跳转到另一个资源的操作叫请求转发
2. 举例:从servlet1到servlet2的操作是请求转发
  - 客户端地址:http://ip:port/工程名/servlet1
  - servlet1程序:
    - 判断是否携带请求参数
    - 处理完servlet1程序需要执行的业务代码后，添加处理完成的标记
    - 去servlet2程序
  - servlet2程序:   
    - 获取请求参数
    - 判断是否有处理完成的标记
    - 处理servlet2程序需要执行的业务代码
  - 这样，servlet1和servlet2协同完成了一个完整的业务功能
3. 特点
   - 浏览器地址没有发生变化
   - 这两个servlet操作是同一个请求
   - 这两个servlet共享Request域中的数据
   - 可以转发到WEB-INF目录下
   - 不可以访问工程外的资源
```java
// servlet1
public class Servlet1 extends HttpServlet { 
    @Override 
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException { 
        // 获取请求的参数
        String username = req.getParameter("username"); 
        System.out.println("在 Servlet1中查看参数：" + username); 
        // 给servlet添加处理完成的标记 
        req.setAttribute("key1","servlet1处理完成的标记"); 
        // 去servlet2程序 
        // 请求转发必须要以斜杠打头，/ 斜杠表示地址为：http://ip:port/工程名/ , 映射到 IDEA 代码的 web 目录 
        RequestDispatcher requestDispatcher = req.getRequestDispatcher("/servlet2"); 
        // RequestDispatcher requestDispatcher = req.getRequestDispatcher("http://www.baidu.com");  
        requestDispatcher.forward(req,resp);
    }
}
```
```java
// servlet2
public class Servlet2 extends HttpServlet { 
    @Override 
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException { 
        // 获取请求的参数
        String username = req.getParameter("username"); 
        System.out.println("在 Servlet2中查看请求参数：" + username); 
        // 查看servlet1是否处理完成 
        Object key1 = req.getAttribute("key1"); 
        System.out.println("servlet1是否处理完成：" + key1); 
        // 处理自己的业务 
        System.out.println("Servlet2处理自己的业务 "); 
    } 
}
```
#### base标签
- base标签可以设置当前页面中所有相对路径工作时，参照哪个路径来进行**正确跳转**
```html
<!DOCTYPE html> 
<html lang="zh_CN"> 
<head> 
    <meta charset="UTF-8"> 
    <title>Title</title> 
    <!--base 标签设置页面相对路径工作时参照的地址 href 属性就是参数的地址值 --> 
    <base href="http://localhost:8080/工程名/xxx/"> 
</head> 
<body> 
    这是xxx下的 c.html 页面<br/> 
    <a href="../../index.html">跳回首页</a><br/> 
</body> 
</html>
```
#### JavaWeb中的路径说明
1. 相对路径
   - . 表示当前目录 
   - .. 表示上一级目录 
   - 资源名 表示当前目录/资源名 
2. 绝对路径
   http://ip:port/工程路径/资源路径 
3. 在实际开发中，路径都使用绝对路径，而不简单的使用相对路径。
     1. 绝对路径 
     2. base+相对
4. /斜杠的意义
   - 是绝对路径
   - / 斜杠如果被**浏览器**解析，得到的地址是：http://ip:port/
        - `<a href="/">斜杠</a>`
   - / 斜杠如果被**服务器**解析，得到的地址是：http://ip:port/工程路径
        1. `<url-pattern>/servlet1</url-pattern>`
        2. `servletContext.getRealPath(“/”);` 
        3. `request.getRequestDispatcher(“/”);`
   - 特殊情况
        - `response.sendRediect(“/”);` 把斜杠发送给浏览器解析。得到 http://ip:port/ 
### HttpServletResponse类
- HttpServletResponse 类和 HttpServletRequest 类一样。每次请求进来，Tomcat 服务器都会创建一个 Response 对象传 递给 Servlet 程序去使用。- HttpServletRequest 表示请求过来的信息，HttpServletResponse 表示所有响应的信息， 我们如果需要设置返回给客户端的信息，都可以通过 HttpServletResponse 对象来进行设置
#### 输出流
1. 字节流 `getOutputStream(); `
   - 常用于下载（传递二进制数据） 
2. 字符流 **`getWriter();`**
   - 常用于回传字符串
3. 注意
   - 两个流同时只能使用一个。 使用了字节流，就不能再使用字符流，反之亦然，否则就会报错。
#### 向客户端回传字符串类型数据
- 比较麻烦，开发成本和维护成本较高，使用<a href="#jsp">**jsp**</a>解决
```java
public class ResponseIOServlet extends HttpServlet { 
    @Override 
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException { 
        PrintWriter writer = resp.getWriter(); 
        writer.write("response's content!!!"); 
    } 
}
```
#### 解决响应的乱码问题
```java
// 它会同时设置服务器和客户端都使用 UTF-8 字符集，还设置了响应头 
// 此方法一定要在获取流对象之前调用才有效 
resp.setContentType("text/html; charset=UTF-8");
```
### 请求重定向
- 请求重定向，是指客户端给服务器发请求，然后服务器告诉客户端说。我给你一些地址。你去新地址访问。叫请求 重定向（因为之前的地址可能已经被废弃）。
#### 步骤原理
1. 客户端http://ip:port/工程路径/response1到Tomcat服务器的Response1程序中
2. Response1程序中，随着项目的不断更新迭代，Response1接口慢慢被废弃了，由新的接口Response2所取代
   - 此时，必须要告诉客户端，接口改变了(响应码302)，且要告诉新的地址(响应头Location)
3. 将Location响应头的新地址传给客户端，客户端解析Response1的结果，发现接口改变了，再次发起新地址的请求
4. 新地址的请求发送给Response2程序，此时，Response2程序替代了Response1程序，实现了功能的更新迭代。此时再将最终结果返回给客户端，解析显示到页面上
#### 特点
1. 浏览器地址会发生变化
2. 是两次请求
3. 不共享Request域中的数据
4. 不能访问WEB-INF下的数据
5. 可以访问工程外的资源
#### 实现请求重定向
```java
// 不推荐
// 设置响应状态码 302 ，表示重定向
resp.setStatus(302); 
// 设置响应头，说明新的地址在哪里 
resp.setHeader("Location", "http://localhost:8080");
```
```java
// 推荐
resp.sendRedirect("http://localhost:8080");
```

## jsp
<a name="jsp"></a>

- JSP(Java Server Pages,Java的服务器页面),用来代替Servlet程序回传html页面的数据。
### 使用jsp
1. 创建:new-jsp/jspx
2. 访问：与html方式相同，地址栏键入/a.jsp
3. jsp的本质:jsp页面本质上是一个 Servlet 程序。
### jsp语法
#### page
jsp 的 page 指令可以修改 jsp 页面中一些重要的属性，或者行为。
1. `language` 属性 表示 jsp 翻译后是什么语言文件。暂时只支持 java。
2. `contentType` 属性 表示 jsp 返回的数据类型是什么。也是源码中 response.setContentType()参数值 
3. `pageEncoding` 属性 表示当前 jsp 页面文件本身的字符集。 
4. `import` 属性 跟 java 源代码中一样。用于导包，导类。
5. `autoFlush` 属性 设置当 out 输出流缓冲区满了之后，是否自动刷新冲级区。默认值是 true
6. `buffer` 属性 设置 out 缓冲区的大小。默认是 8kb
7. `errorPage` 属性 设置当 jsp 页面运行时出错，自动跳转去的错误页面路径。这个路径一般都是以斜杠打头，它表示请求地址为 http://ip:port/工程路径/,映射到代码的 Web 目录
8. `isErrorPage` 属性 设置当前 jsp 页面是否是错误信息页面。默认是 false。如果是 true 可以 获取异常信息。
9. `session` 属性 设置访问当前 jsp 页面，是否会创建 HttpSession 对象。默认是 true。
10. `extends` 属性 设置 jsp 翻译出来的 java 类默认继承谁。
#### 表达式脚本(不推荐使用)
1. 语法：`<%=表达式%>`
2. 作用:输出数据
3. 注意
   - 所有的表达式脚本都会被翻译到_jspService() 方法中
   - 表达式脚本都会被翻译成为 out.print()输出到页面上 
   - 由于表达式脚本翻译的内容都在_jspService() 方法中,所以_jspService()方法中的对象都可以直接使用。 
   - 表达式脚本中的表达式不能以分号结束。
:::tip
使用<a href="#el表达式">el表达式</a>代替jsp表达式脚本
:::
#### 代码脚本
1. 语法`<% java 语句 %>`
2. 作用：可以在 jsp 页面中，编写我们自己需要的功能（写的是 java 语句）。
3. 注意
   - 代码脚本翻译之后都在_jspService 方法中
   - 代码脚本由于翻译到_jspService()方法中，所以在_jspService()方法中的现有对象都可以直接使用。 
   - 还可以由多个代码脚本块组合完成一个完整的 java 语句。 
   - 代码脚本还可以和表达式脚本一起组合使用，在 jsp 页面上输出数据
#### 注释
1. html注释`<!-- html注释 -->`
   - html 注释会被翻译到 java 源代码中。在_jspService 方法里，以 out.writer 输出到客户端。
2. java注释`// 单行java注释``/* 多行java注释 */`
   - java 注释会被翻译到 java 源代码中。
3. jsp注释`<%-- jsp注释 --%>`
   - jsp 注释可以注掉，jsp 页面中所有代码。
### jsp内置对象
Tomcat 在翻译 jsp 页面成为 Servlet 源代码后，内部提供的九个对象
1. request
2. response
3. pageContext
4. session
5. application
6. config
7. out
8. page
9. exception
#### jsp 中的 out 输出和 response.getWriter 输出的区 别
- 由于 jsp 翻译之后，底层源代码都是使用 out 来进行输出，所以一般情况下。我们**在 jsp 页面中统一使用 out 来进行输出**。避 免打乱页面输出内容的顺序。
### jsp域对象
1. pageContext(优先顺序最优先)
2. request(优先顺序次之)
3. session(优先顺序次之)
4. application(优先顺序最低)
```jsp
<body> 
    <h1>scope.jsp 页面</h1> 
    <% 
        // 往四个域中都分别保存了数据 
        pageContext.setAttribute("key", "pageContext"); 
        request.setAttribute("key", "request"); 
        session.setAttribute("key", "session"); 
        application.setAttribute("key", "application"); 
    %>
        pageContext 域是否有值：<%=pageContext.getAttribute("key")%> <br> 
        request 域是否有值：<%=request.getAttribute("key")%> <br> 
        session 域是否有值：<%=session.getAttribute("key")%> <br> 
        application 域是否有值：<%=application.getAttribute("key")%> <br> 
    <% 
        request.getRequestDispatcher("/scope2.jsp").forward(request,response); 
    %> 
</body>
```
```jsp
<body> 
    <h1>scope2.jsp 页面</h1> 
    pageContext 域是否有值：<%=pageContext.getAttribute("key")%> <br> 
    request 域是否有值：<%=request.getAttribute("key")%> <br> 
    session 域是否有值：<%=session.getAttribute("key")%> <br> 
    application 域是否有值：<%=application.getAttribute("key")%> <br> 
</body>
```
### jsp标签
#### 静态包含
```jsp
<!-- 
    file 属性指定你要包含的 jsp 页面的路径
    地址中第一个斜杠 / 表示为 http://ip:port/工程路径/ 映射到代码的 web 目录
    静态包含特点：
        1. 静态包含不会翻译被包含的 jsp 页面
        2. 静态包含其实是把被包含的 jsp 页面的代码拷贝到包含的位置执行输出。 
-->
<%@ include file="/include/footer.jsp"%>
```
#### 动态包含
```jsp
<!-- 
    page 属性是指定你要包含的 jsp 页面的路径
    动态包含也可以像静态包含一样。把被包含的内容执行输出到包含位置
    动态包含的特点： 
        1. 动态包含会把包含的 jsp 页面也翻译成为 java 代码 
        2. 动态包含底层代码使用如下代码去调用被包含的 jsp 页面执行输出。 JspRuntimeLibrary.include(request, response, "/include/footer.jsp", out, false); 
        3. 动态包含，还可以传递参数
 -->
<jsp:include page="/include/footer.jsp"> 
    <jsp:param name="username" value="bbj"/> 
    <jsp:param name="password" value="root"/> 
</jsp:include>
```
#### 转发
```jsp
<!-- page 属性设置请求转发的路径 -->
<jsp:forward page="/scope2.jsp"></jsp:forward>
```
## Listener监听器
- 监听某种事物的变化。然后通过回调函数，反馈给客户（程序）去做一些相应的处理。
### ServletContextListener监听器
- ServletContextListener 它可以监听 ServletContext 对象的创建和销毁。 
- ServletContext 对象在 web 工程启动的时候创建，在 web 工程停止的时候销毁。 
- 监听到创建和销毁之后都会分别调用 ServletContextListener 监听器的方法反馈。
```java
// 实现ServletContextListener
public interface ServletContextListener extends EventListener { 
    // 在 ServletContext 对象创建之后马上调用，做初始化
    public void contextInitialized(ServletContextEvent sce); 

    // 在 ServletContext 对象销毁之后调用
    public void contextDestroyed(ServletContextEvent sce); 
}
```
```java
// 监听器实现类
public class MyServletContextListenerImpl implements ServletContextListener { 
    @Override public void contextInitialized(ServletContextEvent sce) { 
        System.out.println("ServletContext 对象被创建了"); 
    }

    @Override public void contextDestroyed(ServletContextEvent sce) { 
        System.out.println("ServletContext 对象被销毁了"); 
    } 
}
```
```xml
<!-- web.xml配置监听器 -->
<listener> 
<listener-class>com.hyy.listener.MyServletContextListenerImpl</listener-class> 
</listener>
```
### el表达式
<a name="el表达式"></a>

## Cookie
- Cookie是服务器通知客户端保存键值对的一种技术。 
- 客户端有了 Cookie 后，每次请求都发送给服务器。 
- 每个 Cookie 的大小不能超过 4kb
### 在Servlet中创建Cookie
```java
protected void createCookie(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException { 
    //1 创建 Cookie 对象
    Cookie cookie = new Cookie("key4", "value4"); 
    //2 通知客户端保存 
    Cookie resp.addCookie(cookie); 
    //1 创建 Cookie 对象 
    Cookie cookie1 = new Cookie("key5", "value5"); 
    //2 通知客户端保存 
    Cookie resp.addCookie(cookie1); 
    resp.getWriter().write("Cookie 创建成功"); 
}
```
### 服务器获取客户端发送过来的Cookie
`req.getCookies():Cookie[]`
### 查找指定的Cookie
```java
protected void getCookie(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException { 
    Cookie[] cookies = req.getCookies(); 
    for (Cookie cookie : cookies) { 
        // getName 方法返回 Cookie 的 key（名） 
        // getValue 方法返回 Cookie 的 value 值 
        resp.getWriter().write("Cookie[" + cookie.getName() + "=" + cookie.getValue() + "] <br/>"); 
    }
    Cookie iWantCookie = CookieUtils.findCookie("key1", cookies); 
    
    // for (Cookie cookie : cookies) { 
    //     if ("key2".equals(cookie.getName())) { 
    //         iWantCookie = cookie; 
    //         break; 
    //     } 
    // }   

    // 如果不等于 null，说明赋过值，也就是找到了需要的Cookie 
    if (iWantCookie != null) { 
        resp.getWriter().write("找到了需要的 Cookie"); 
    } 
}
```
### 修改Cookie值
#### 方法一
1. 先创建一个要修改的同名（指的就是 key）的 Cookie 对象 
2. 在构造器，同时赋于新的 Cookie 值。 
3. 调用 response.addCookie( Cookie ),通知 客户端 保存修改;
```java
Cookie cookie = new Cookie("key1","newValue1"); 
resp.addCookie(cookie);
```
#### 方法二
1. 先查找到需要修改的 Cookie 对象 
2. 调用 setValue()方法赋于新的 Cookie 值。 
3. 调用 response.addCookie()通知客户端保存修改
```java
Cookie cookie = CookieUtils.findCookie("key2", req.getCookies()); 
if (cookie != null) {  
    cookie.setValue("newValue2"); 
    resp.addCookie(cookie); 
}
```
### 浏览器查看Cookie
- 谷歌-F12-Application-Cookies
    - 三个按钮
        1. 刷新
        2. 删除全部Cookie
        3. 删除指定的Cookie
### Cookie生命控制
- 管理 Cookie 什么时候被销毁（删除）
- `setMaxAge()` 
    - 正数，表示在指定的秒数后过期 
    - 负数，表示浏览器一关，Cookie 就会被删除（默认值是-1）
    - 零，表示马上删除 Cookie
```java
protected void life3600(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException { 
    Cookie cookie = new Cookie("life3600", "life3600"); 
    cookie.setMaxAge(60 * 60); 
    // 设置 Cookie 一小时之后被删除。无效 
    resp.addCookie(cookie); 
    resp.getWriter().write("已经创建了一个存活一小时的 Cookie"); 
}
```
### 设置Cookie的有效路径
- Cookie 的 path 属性可以有效的过滤哪些 Cookie 可以发送给服务器。哪些不发。 
- path 属性是通过请求的地址来进行有效的过滤。 
- CookieA path=/工程路径 
- CookieB path=/工程路径/abc 
- 请求地址如下： 
    - http://ip:port/工程路径/a.html 
        - CookieA 发送 
        - CookieB 不发送 
    - http://ip:port/工程路径/abc/a.html 
        - CookieA 发送 
        - CookieB 发送
```java
protected void testPath(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    Cookie cookie = new Cookie("path1", "path1"); 
    // getContextPath() ===>>>> 得到工程路径 
    cookie.setPath( req.getContextPath() + "/abc" ); 
    // ===>>>> /工程路径/abc 
    resp.addCookie(cookie); 
    resp.getWriter().write("创建了一个带有 Path 路径的 Cookie"); 
}
```
## Session
1. Session 就一个接口（HttpSession）。
2. Session 就是会话。它是用来维护一个客户端和服务器之间关联的一种技术。 
3. 每个客户端都有自己的一个 Session 会话。 
4. Session 会话中，我们经常用来保存用户登录之后的信息。
### 创建和获取Session
- `request.getSession()`
    - 第一次调用是：创建 Session 会话 
    - 之后调用都是：获取前面创建好的 Session 会话对象。
- `isNew();` 
    - 判断到底是不是刚创建出来的（新的）
    - true 表示刚创建 
    - false 表示获取之前创建
- `getId()` 
    - 得到 Session 的会话 id 值。
- `req.getSession().setAttribute("key1", "value1");`
    - 往Session中存数据
- `Object attribute = req.getSession().getAttribute("key1");`
    - 从Session中取数据
### Session的生命周期控制
- 超时：客户端两次请求的最大间隔时长
- Session 默认的超时时间长为 30 分钟。
- Session的底层是Cookie
```xml
<!-- web.xml -->
<!-- 修改web 工程所有 Seession 的默认超时时长 -->
<session-config>    
    <session-timeout>30</session-timeout>   
</session-config>
```
`session.setMaxInactiveInterval(int interval)单独设置超时时长`
## 过滤器
- 拦截请求，过滤响应。
- 常见的应用场景
    - 权限检查 
    - 日记操作
    - 事务管理
### 应用
- 在 web 工程下，有一个 admin 目录。这个 admin 目录下的所有资源（html 页面、jpg 图片、jsp 文件、等等）都必 须是用户登录之后才允许访问。
- 用户登录之后都会把用户登录的信息保存到 Session 域中。所以要检查用户是否 登录，可以判断 Session 中否包含有用户登录的信息即可
```java
public class AdminFilter implements Filter { 
    /*** doFilter 方法，专门用于拦截请求。可以做权限检查 */ 
    @Override 
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException { 
        HttpServletRequest httpServletRequest = (HttpServletRequest) servletRequest; 
        HttpSession session = httpServletRequest.getSession(); 
        Object user = session.getAttribute("user"); 
        // 如果等于 null，说明还没有登录 
        if (user == null) { 
            servletRequest.getRequestDispatcher("/login.jsp").forward(servletRequest,servletResponse); 
            return; 
        } else { 
            // 让程序继续往下访问用户的目标资源 
            filterChain.doFilter(servletRequest,servletResponse); 
        } 
    } 
}
```
```xml
<!-- web.xml -->
<!--filter 标签用于配置一个 Filter 过滤器--> 
<filter> 
    <!--给 filter 起一个别名--> 
    <filter-name>AdminFilter</filter-name> 
    <!--配置 filter 的全类名--> 
    <filter-class>com.hyy.filter.AdminFilter</filter-class> 
</filter>

<!--filter-mapping 配置 Filter 过滤器的拦截路径--> 
<filter-mapping> 
    <!--filter-name 表示当前的拦截路径给哪个 filter 使用--> 
    <filter-name>AdminFilter</filter-name> 
    <!--url-pattern 配置拦截路径 / 表示请求地址为：http://ip:port/工程路径/ 映射到 IDEA 的 web 目录 /admin/* 表示请求地址为：http://ip:port/工程路径/admin/* --> 
    <url-pattern>/admin/*</url-pattern>
</filter-mapping>
```
### 生命周期
1. 构造器方法
2. init 初始化方法 
   - 第 1，2 步，在 web 工程启动的时候执行（Filter 已经创建） 
3. doFilter 过滤方法 
   - 第 3 步，每次拦截到请求，就会执行 
4. destroy 销毁 
   - 第 4 步，停止 web 工程的时候，就会执行（停止 web 工程，也会销毁 Filter 过滤器）
### FilterConfig类
- Tomcat 每次创建 Filter 的时候，也会同时创建一个 FilterConfig 类，这里包含了 Filter 配置文件的配置信息。 
- FilterConfig 类的作用是获取 filter 过滤器的配置内容 
    1. 获取 Filter 的名称 filter-name 的内容
    2. 获取在 Filter 中配置的 init-param 初始化参数
    3. 获取 ServletContext 对象
### FilterChain 过滤器链
- 多个过滤器如何一起工作
### 拦截路径
1. 精确匹配
   - `<url-pattern>/target.jsp</url-pattern>`
   - 以上配置的路径，表示请求地址必须为：http://ip:port/工程路径/target.jsp
2. 目录匹配
   - `<url-pattern>/admin/*</url-pattern>`
   - 以上配置的路径，表示请求地址必须为：http://ip:port/工程路径/admin/*
3. 后缀名匹配
   - `<url-pattern>*.html</url-pattern>`
   - 以上配置的路径，表示请求地址必须以.html 结尾才会拦截到 
   - `<url-pattern>*.do</url-pattern> `
   - 以上配置的路径，表示请求地址必须以.do 结尾才会拦截到 
   - `<url-pattern>*.action</url-pattern>` 
   - 以上配置的路径，表示请求地址必须以.action 结尾才会拦截到 
   - Filter 过滤器它只关心请求的地址是否匹配，不关心请求的资源是否存在！！！