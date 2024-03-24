---
title: Java-基础-IO流
article: false
category:
  - Java
  - Java基础
---
## 文件的相关操作
### 创建文件
- new File
  - new File(String pathname):根据路径构造一个File对象
  - new File(File parent,String child):根据父目录文件+子路径构建
  - new File(String parent,String child):根据父目录+子路径构建
- file.createNewFile：在磁盘中创建真正的文件
## 文件流
- 文件流(I/O流)
  - 文件在程序中是以流的形式来操作
  - 输入流(Input)
    - 把磁盘中的文件数据通过输入流读取到java程序(内存中)
  - 输出流(Output)
    - 把内存中的文件数据通过输出流写入到磁盘中的文件中
