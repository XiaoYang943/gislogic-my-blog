---
title: Java-基础-反射
article: false
category:
  - Java
  - Java基础
---

## 反射
### 反射概述
- Reflection（反射）是被视为动态语言的关键，反射机制允许程序在执行期借助于Reflection API取得任何类的内部信息，并能直接操作任意对象的内部属性及方法。
- 加载完类之后(.java文件编译后生成的.class文件被执行)，在堆内存的方法区中就产生了一个Class类型的对象（一个类只有一个Class对象）。这个对象就包含了完整的类的结构信息，反射就是**把Java类中的各个组成部分映射成一个个的Java对象**,获取到这些对象之后，就可以对这些对象进行操作
### 获取要反射的java类
1. `Class clazz = Class.forName("要反射的类的全路径")`
2. `Class clazz = 类名.class`
3. `类名对象 简写 = new 类名();简写.getClass();`
### 获取要反射的java类的成员
#### 获取public声明的的成员
- `public Constructor getConstructor(Class<?>…parameterTypes)`
- `public Method getMethod(String name,Class<?>… parameterTypes)`
- `public Field getField(String name)`
#### 获取private声明的成员
1. 获取成员
   - `public Constructor getDeclaredConstructor(Class<?>…parameterTypes)`
   - `public Method getDeclaredMethod(String name,Class<?>… parameterTypes)`
   - `public Field getDeclaredField(String name)`
2. 设置该成员能够被访问
   `成员.setAccessible(true);`   
### 反射的应用
#### 动态代理与AOP
