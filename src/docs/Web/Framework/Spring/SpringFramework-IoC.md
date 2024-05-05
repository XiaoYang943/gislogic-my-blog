---
title: SpringFramework-IoC
article: false
category:
  - Java
  - Spring
---
## IoC
- IoC是什么
  - IoC(Inversion of Control):控制反转，是一种设计思想，是一个重要的面向对象编程法则，能够设计出松耦合、更优良的程序。
- 反转的是什么
  - 将对象的创建权利交出去，交给IoC容器负责。
  - 将对象和对象之间关系的维护权交出去，交给IoC容器负责。
- 作用
  - 降低程序耦合度，提高程序扩展力
- IoC思想如何实现
  - 依赖注入
### IoC容器
- 作用
  - Spring通过IoC容器来管理所有Java对象的实例化和初始化，控制对象与对象之间的依赖关系
- Bean
  - 什么是Bean
    - 由IoC容器管理的Java对象(组件)称为Spring Bean
    - 它与使用关键字new创建的Java对象没有任何区别
    - 在创建bean之前，首先需要创建IoC容器
  - 如何管理Bean
    - 方式一：基于XML配置文件
    - 方式二：基于注解(重要)
- IoC容器的实现方式
  - BeanFactory接口，是IoC容器的基本实现，是Spring内部使用的接口。面向Spring本身，不提供给开发人员使用
  - ApplicationContext接口，是BeanFactory的子接口，提供了更多高级特性。面向Spring的使用者
    - ApplicationContext接口的实现类
| 类型名                          | 简介                                                         |
| ------------------------------- | ------------------------------------------------------------ |
| ClassPathXmlApplicationContext  | 通过读取类路径下的 XML 格式的配置文件创建 IOC 容器对象       |
| FileSystemXmlApplicationContext | 通过文件系统路径读取 XML 格式的配置文件创建 IOC 容器对象     |
| ConfigurableApplicationContext  | ApplicationContext 的子接口，包含一些扩展方法 refresh() 和 close() ，让 ApplicationContext 具有启动、关闭和刷新上下文的能力。 |
| WebApplicationContext           | 专门为 Web 应用准备，基于 Web 环境创建 IOC 容器对象，并将对象引入存入 ServletContext 域中。 |
### 依赖注入
- 什么是依赖注入
  - 依赖注入(Dependency Injection,DI)指Spring创建对象的过程中，将对象依赖属性通过配置进行注入
- 实现方式
  - 第一种：set注入
  - 第二种：构造注入
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="personSet" class="com.gisyang.spring6.iocxml.di.Person">
        <!-- property 调用set方法，完成属性注入-->
        <property name="name" value="hyy"></property>
        <property name="age" value="18"></property>
    </bean>

    <bean id="personConstructor" class="com.gisyang.spring6.iocxml.di.Person">
        <!-- constructor-arg 调用constructor方法，完成属性注入-->
        <constructor-arg name="name" value="hyy"></constructor-arg>
        <constructor-arg name="age" value="18"></constructor-arg>
    </bean>
</beans>
```
```java
public class Person {
    private String name;
    private Integer age;

    // 生成属性的set方法
    public void setName(String name) {
        this.name = name;
        System.out.println("set方法执行了...");
    }
    public void setAge(Integer age) {
        this.age = age;
    }

    // 生成属性的构造方法
    public Person(String name, Integer age) {
        this.name = name;
        this.age = age;
        System.out.println("有参构造执行了...");
    }
    public Person() {
    }

    // toString，方便打印测试
    @Override
    public String toString() {
        return "Person{" +
                "name='" + name + '\'' +
                ", age=" + age +
                '}';
    }

    // 创建对象时，设置属性值
    public static void main(String[] args) {
        // 1. 原生方法：set方法设置属性值
        Person person = new Person();
        person.setName("hyy");
        person.setAge(18);
        System.out.println(person);

        // 2. 原生方法：通过构造器设置属性值
        Person person1 = new Person("hyy", 18);
        System.out.println(person1);

        ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext("bean.xml");
        // 3. spring：基于set方法设置属性值(属性注入)
        Person person2 = context.getBean("personSet",Person.class);
        System.out.println(person2);

        // 4. spring：基于有参构造方法设置属性值(属性注入)
        Person person3 = context.getBean("personConstructor",Person.class);
        System.out.println(person3);
    }
}
```
```
set方法执行了...
Person{name='hyy', age=18}
有参构造执行了...
Person{name='hyy', age=18}
2023-08-19 15:57:35,409 main ERROR Unable to locate appender "log" for logger config "root"
2023-08-19 15:57:35 489 [main] DEBUG org.springframework.context.support.ClassPathXmlApplicationContext - Refreshing org.springframework.context.support.ClassPathXmlApplicationContext@479cbee5
2023-08-19 15:57:35 581 [main] DEBUG org.springframework.beans.factory.xml.XmlBeanDefinitionReader - Loaded 2 bean definitions from class path resource [bean.xml]
2023-08-19 15:57:35 599 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'personSet'
set方法执行了...
2023-08-19 15:57:35 638 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'personConstructor'
2023-08-19 15:57:35 655 [main] WARN org.springframework.core.LocalVariableTableParameterNameDiscoverer - Using deprecated '-debug' fallback for parameter name resolution. Compile the affected code with '-parameters' instead or avoid its introspection: com.gisyang.spring6.iocxml.di.Person
有参构造执行了...
Person{name='hyy', age=18}
Person{name='hyy', age=18}

Process finished with exit code 0

```
## 基于XML管理Bean
### 获取Bean
- 方式
  - 根据id获取
  - 根据类型获取
  - 根据id和类型获取
```java
public static void main(String[] args) {
  ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext("bean.xml");
  User user = (User) context.getBean("user"); // 根据id获取
  User user = context.getBean(User.class);  // 根据类型获取
  User user = context.getBean("user", User.class);  // 根据id和类型获取
}
```
#### 异常
- `org.springframework.beans.factory.NoUniqueBeanDefinitionException: No qualifying bean of type 'xxx' available: expected single matching bean but found 2: xxx,xxx`
##### 原因1
  - 当IoC中配置了同一个类的两个不同id的bean时，且此时只用类型获取
  ```xml
  <bean id="userOne" class="...User"></bean>
  <bean id="userTwo" class="...User"></bean>
  ```
  - 解决
    - 此时用id+type方式获取
##### 原因2
![接口和实现类](https://blog-image-9943.oss-cn-beijing.aliyuncs.com/202308191609131.png)
```xml
<bean id="userDaoImpl" class="com.gisyang.spring6.iocxml.bean.UserDaoImpl"></bean>
<bean id="userDaoImpl2" class="com.gisyang.spring6.iocxml.bean.UserDaoImpl2"></bean>
```
```java
public class TestUserDao {
  public static void main(String[] args) {
    ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext("bean.xml");
    // 接口只有一个实现类，且注入到IoC容器中，能够得到其实现类对象
    // 接口有多个实现类，且都注入到IoC容器中，不能够得到其实现类对象,会报错
    UserDao userDao = context.getBean(UserDao.class);
    userDao.run();
  }
}
```
- 解决
  - @Autowired+@Qualifier

## 基于注解管理Bean(重要) 
- 什么是注解
  - 注解（Annotation）是代码中的一种特殊标记，可以在编译、类加载和运行时被读取，执行相应的处理。开发人员可以通过注解在不改变原有代码和逻辑的情况下，在源代码中嵌入补充信息。
- 作用
  - 使用注解来实现自动装配，简化Spring的XML配置
- 注解的位置
  - 类、方法、属性
- 有哪些注解
  - @Component
  - @Repository
  - @Service
  - @Controller
  - @Autowired
  - @Resource
  - @Qualifier
  - @Configuration
  - @ComponentScan
  - @Scope
### 将类定义成Bean的注解
- Spring提供以下注解，标注在 Java 类上，将它们定义成 Spring Bean，即Bean对象的创建。
| 注解        | 说明                                                         |
| ----------- | ------------------------------------------------------------ |
| @Component  | 该注解用于描述 Spring 中的 Bean，它是一个泛化的概念，仅仅表示容器中的一个组件（Bean），并且可以作用在应用的任何层次，例如 Service 层、Dao 层等。  使用时只需将该注解标注在相应类上即可。 |
| @Repository | 该注解用于将数据访问层（Dao 层）的类标识为 Spring 中的 Bean，其功能与 @Component 相同。 |
| @Service    | 该注解通常作用在业务层（Service 层），用于将业务层的类标识为 Spring 中的 Bean，其功能与 @Component 相同。 |
| @Controller | 该注解通常作用在控制层（如SpringMVC 的 Controller），用于将控制层的类标识为 Spring 中的 Bean，其功能与 @Component 相同。 |
- 注意
  - @Repository和@Service都是给实现类加注解，而不是其接口。因为创建对象是类而不是接口
  - controller中注入service，service中注入dao
```java
@Component  //  默认值为类的小写名，相当于<bean id="user" class="xxx">
// @Component(value = "user")
public class User {}
```
### 实现Bean自动装配(属性注入)的注解
#### @Autowired
- 怎样装配
  - 根据名称进行装配(byName),需要配合@Qualifier注解一起使用
  - 根据类型进行装配(byType,默认)
- 位置
  - 属性上(常用)
  - 构造方法上
  - 构造方法的参数上
  - setter方法上
- 属性注入：定义属性，在属性上定义Autowired注解，根据类型找到对应对象，完成注入
```java
@Controller
public class UserController {
  // 注入service，根据类型找到UserService接口对应的实现类对象，完成注入
  @Autowired
  private UserService userService;
}
```
```java
@Service
public class UserServiceImpl implements UserService {
  // 注入dao，根据类型找到UserDao接口对应的实现类对象，完成注入
  @Autowired
  private UserDao userDao;
}
```
```java
@Repository
public class UserDaoImpl implements UserDao {
  ...
}
```
#### @Autowired+@Qualifier
- 当接口有多个实现类时，且使用Autowired根据类型注入，会报错
  - 报错：`org.springframework.beans.factory.NoUniqueBeanDefinitionException: No qualifying bean of type 'xxx' available: expected single matching bean but found 2: xxx,xxx`
```java
@Service
public class UserServiceImpl implements UserService {
  @Autowired  // 根据类型注入
  private UserDao userDao;
}
```
```java
@Repository
public class UserDaoImpl implements UserDao {
  ...
}
```java
@Repository
public class UserRedisDaoImpl implements UserDao {
  ...
}
```
- 解决
  - 使用@Autowired+@Qualifier，根据名称注入
```java
@Service
public class UserServiceImpl implements UserService {
  @Autowired
  @Qualifier(value="userDaoImpl")  // 根据名称注入,默认名称是首字母小写的类名
  private UserDao userDao;
}
```
#### @Resource
- 作用
  - 也可以完成属性注入
- 和@Autowired的区别

|| @Autowired | @Resource|
| ----------- | ----------- | ----------- |
| 来源 | Spring框架 | JDK扩展包，是标准注解，更加通用。高于JDK11或低于JDK8需要引入额外依赖 |
| 默认通过什么方式装配 | 默认根据类型装配，如果想根据名称装配，需要配合@Qualifier注解一起用 | 默认根据名称装配，未指定name时，使用属性名作为name。通过name找不到的话会自动启动通过类型装配 |
| 位置 | 用在属性上、setter方法上、构造方法上、构造方法参数上 | 用在属性上、setter方法上 |
- 依赖
```xml
<dependency>
    <groupId>jakarta.annotation</groupId>
    <artifactId>jakarta.annotation-api</artifactId>
    <version>2.1.1</version>
</dependency>
```
### 替换Spring的xml配置文件
- @Configuration：类注解，设置该类为Spring配置类
- @ComponentScan：类注解，配置包扫描路径
  - 替换掉`<context:component-scan base-package="..."/>`

## Bean
### Bean的生命周期
- 生命周期
  - bean对象创建（调用无参构造器）
  - 给bean对象设置属性
  - bean的后置处理器（初始化之前）
  - bean对象初始化（需在配置bean时指定初始化方法）
  - bean的后置处理器（初始化之后）
  - bean对象就绪可以使用
  - bean对象销毁（需在配置bean时指定销毁方法）
  - IOC容器关闭
```xml
<!-- bean-lifecycle.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
    <bean id="user" class="com.gisyang.spring6.iocxml.lifecycle.User" init-method="initMethod" destroy-method="destroyMethod">
        <property name="name" value="hyy"></property>
    </bean>
    <bean id="myBeanPost" class="com.gisyang.spring6.iocxml.lifecycle.MyBeanPost"></bean>
</beans>
```
```java
public class User {
    private String name;
    public String getName() {
        return name;
    }
    public User() {
        System.out.println("1. bean对象创建，无参构造方法执行了...");
    }
    public void setName(String name) {
        this.name = name;
        System.out.println("2. 给bean对象设置属性值，set方法执行了...");

    }
    // 初始化的方法
    public void initMethod() {
        System.out.println("4. bean对象初始化，初始化方法执行了...");
    }
    // 销毁的方法
    public void destroyMethod() {
        System.out.println("7. bean对象销毁，销毁方法执行了...");
    }
    public static void main(String[] args) {
        ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext("bean-lifecycle.xml");
        User user = context.getBean("user", User.class);
        System.out.println("6. bean对象创建完成，可以使用了...");
        context.close();
        System.out.println("8. bean对象销毁了");
    }
}
```
```java
public class MyBeanPost implements BeanPostProcessor {
    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        System.out.println("3. bean后置处理器，初始化之前执行...");
        return BeanPostProcessor.super.postProcessBeforeInitialization(bean, beanName);
    }
    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        System.out.println("5. bean后置处理器，初始化之后执行...");
        return BeanPostProcessor.super.postProcessAfterInitialization(bean, beanName);
    }
}
```
```
1. bean对象创建，无参构造方法执行了...
2. 给bean对象设置属性值，set方法执行了...
3. bean后置处理器，初始化之前执行...
4. bean对象初始化，初始化方法执行了...
5. bean后置处理器，初始化之后执行...
6. bean对象创建完成，可以使用了...
7. bean对象销毁，销毁方法执行了...
8. bean对象销毁了

Process finished with exit code 0
```
### Bean的作用域
- bean的作用域范围
  - 单例(默认)
  - 多例

| 取值              | 含义                                    | 创建对象的时机  |
| ----------------- | --------------------------------------- | --------------- |
| singleton（默认） | 在IOC容器中，这个bean对象只有一个实例 | IOC容器初始化时只创建一个对象，是一个全局的共享的实例 |
| prototype         | 在IOC容器中，这个bean对象有多个实例 | 每次getBean时都会创建一个新的对象     |

```java
Person person1 = context.getBean(...);
Person person2 = context.getBean(...);
System.out.println(person1 == person2); // true,单实例对象：person1和person2的地址值相同，是同一个对象
System.out.println(person1 == person2); // false,多实例对象：person1和person2的地址值不同，不是同一个对象
```
- 如何更改bean的作用域
  - xml中使用bean标签的scope属性
  - 注解中使用类的@Scope注解
#### Bean是否是线程安全
![Bean是否是线程安全](https://blog-image-9943.oss-cn-beijing.aliyuncs.com/202308191812344.png)
- 多例Bean不存在线程安全问题
  - 每次getBean时都会创建一个新的对象，每个线程**独占**一个Bean
- 单例Bean**可能**存在线程安全问题
  - 因为所有线程**共享**同一个Bean
  - 单例Bean分为：
    - 无状态Bean：多线程操作中，只会对Bean的成员变量进行查询操作，不会修改成员变量
      - 无状态的单例Bean不存在线程安全问题
    - 有状态Bean：多线程操作中，对Bean的成员变量进行更新操作
      - 有状态的单例Bean存在线程安全问题
- 解决有状态的单例Bean的线程安全问题：
  1. 方案一：将Bean的作用于改为多例Bean
  2. 方案二：在Bean对象中避免定义可变的成员变量(几乎不可能)
  3. 方案三：在类中定义ThreadLocal(具备线程隔离的特性，为每个线程提供一个独立的变量副本，每个线程只需要操作自己的现成变量副本)，将可变的成员变量保存在ThreadLocal中

