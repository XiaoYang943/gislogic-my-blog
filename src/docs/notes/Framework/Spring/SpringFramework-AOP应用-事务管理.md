---
title: SpringFramework-AOP应用-事务管理
article: false
category:
  - Java
  - Spring
---
## 基于AOP实现事务管理
### 发现问题
- 编程式事务问题
```java
Connection conn = ...
try {
  // 开启事务：关闭事务的自动提交
  conn.setAutoCommit(false);

  // 核心操作

  // 提交事务 
  conn.commit();
}catch(Exception e){
  // 回滚事务 
  conn.rollBack();
}finally{
  // 释放数据库连接
  conn.close();
}
```
- 缺点
  - 细节没有被屏蔽：具体操作过程中，所有细节都需要程序员自己来完成，比较繁琐。
  - 代码耦合度较高、复用性不高
### 解决问题
- 声明式事务
