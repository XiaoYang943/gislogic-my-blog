---
title: ProtocolBuffers
category:
  - GIS
  - 空间数据格式
  - ProtocolBuffers
---
## 什么是Protocol Buffers
- Protocol Buffers(PBF)是一种与编程语言无关、与平台架构无关、可扩展性强的**序列化数据**机制
## PBF的优点(https://protobuf.dev/overview/#benefits)
### 跨语言兼容性(https://protobuf.dev/overview/#cross-lang)
- 支持多种语言
### 跨平台支持(https://protobuf.dev/overview/#cross-proj)
- 可生成不同语言的代码并在任何环境中运行
### 性能好、扩展性好
- 序列化和反序列化的性能比JSON和XML更快
## PBF的缺点
### 什么情况下不适用PBF(https://protobuf.dev/overview/#not-good-fit)
## HelloWorld(Java版)(https://protobuf.dev/overview/#work)
### 1. 安装编译器
1. [下载](https://protobuf.dev/downloads/)
2. 解压缩
3. 配置环境变量-Path-`...\bin`
4. 验证-cmd-`protoc --version`
### 2. 定义.proto数据结构
- `PersonMsg.proto`
```protobuf
syntax = "proto2";
package com.pbftest.test;

option java_outer_classname = "PersonBean";

message Person {
  required string name = 1;
  required int32 age = 2;
  optional string gender = 3;
}
```
### 3. 编译.proto
- 编译命令`protoc.exe --java_out=./ PersonMsg.proto`
  - 或者IDEA安装`Protocol Buffers`和`GenProtobuf`插件，IDEA菜单栏-Tools-设置GenProtobuf-设置protoc.exe路径及java语言-右键.proto文件生成protobuf
- 编译`.proto`后，会创建一个java类，可以使用该类来创建新实例
### 4. 创建新的示例并序列化
```java
import com.pbftest.test.PersonBean;

import java.io.ByteArrayInputStream;
import java.io.IOException;

public class SimulatedClientServer {

    // 模拟服务器
    public static void Server(ByteArrayInputStream input){
        // 从输入流中解析出 Person 对象
        try {
            PersonBean.Person person = PersonBean.Person.parseFrom(input);
            if (person != null) {
                System.out.println("服务端收到的数据:\n" + person.toString());
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    // 模拟客户端
    public static byte[] Client() {
        // 构造一个 Person 对象
        PersonBean.Person person = PersonBean.Person.newBuilder()
                .setName("zhangsan")
                .setAge(18)
                .setGender("male")
                .build();


        long pbfStartTime = System.currentTimeMillis();

        // 将 Person 对象序列化为字节数组
        byte[] serializedPerson = person.toByteArray();

        long pbfEndTime = System.currentTimeMillis();
        long pbfSerializationTime = pbfEndTime - pbfStartTime;
        System.out.println("序列化所耗时间" + pbfSerializationTime + " ms");
        return serializedPerson;
    }

    public static void main(String[] args){
        // 模拟客户端发送数据
        byte[] serializedPerson = Client();

        // 使用字节数组输入流模拟网络传输
        ByteArrayInputStream bais = new ByteArrayInputStream(serializedPerson);

        // 模拟服务器接收数据
        Server(bais);

        // 因为使用了字节数组输入流，所以不需要关闭它
        // 如果是真实的网络流，则在处理完毕后需要关闭
    }
}
```
- 运行结果:
```
序列化所耗时间12 ms
服务端收到的数据:
name: "zhangsan"
age: 18
gender: "male"
```
## PBF的数据结构(https://protobuf.dev/overview/#syntax)
### 关键字
- message：代表实体结构，由多个消息字段field组成
- required：表示该字段是必需的
- optional：表示该字段是可选的
- repeated：表示该字段的值是一个列表，可以包含0个或多个元素
- group：用于组织多个字段，但目前该关键字已被废弃，应使用message
- syntax：用于指定协议版本号，没有指定则默认为proto2版本
- package：相等于C++中的命名空间，为了防止名称冲突
- import：引入其他的proto文件，可以使用其他proto文件中定义的消息类型
- message：用于定义消息类型，相当于C++中的struct
- enum：用于定义枚举类型，相当于C++中的enum
- option：用于设置消息字段的选项，如default、packed等
- extensions：用于定义扩展消息字段，可以在现有消息类型的基础上添加新的字段
- rpc：用于定义远程过程调用（RPC）服务
- service：用于定义服务接口
- default ：用于为字段设置默认值
- packed ：用于指示字段值应该进行压缩存储
- max ：用于指定枚举类型的最大值
- value ：用于指定枚举类型的值
- returns ：用于指定RPC服务的返回类型
