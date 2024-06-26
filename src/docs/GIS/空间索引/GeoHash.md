---
title: GeoHash
category:
  - GIS
  - 空间索引
  - GeoHash
---
## GeoHash
- GeoHash是一种空间索引，它将地理位置编码为一个由字母和数字组成的字符串或一个纯数字整数。是一种降维的思想，将二维的数据转化为一维的数据
- GeoHash属于空间填充曲线中的Z阶曲线(Z-order curve)的实际应用
### 特点
- 每一个GeoHash字符串代表了某一矩形区域
    - 这个矩形区域内所有的点都共享相同的GeoHash字符串
## GeoHash的作用
### 最近邻查询
- 场景：计算离A位置最近的点
- 暴力法：遍历研究区所有点，分别与A点计算距离，记录最小值
    - 计算量太大，很多计算都是无用功
- 解决
    - 不计算所有点的距离，而是缩小范围，先求出A位置**相对比较近的点**，再在这些点中分别计算距离，记录最小值
    - 而这些**相对比较近的点**一定是与A点的GeoHash值相同
- 存在问题
    - 单个GeoHash范围存在**边界问题**
        - .eg:
            - 点A和点B在同一个GeoHash范围内，点A在左上角，点B在右下角，点C在该GeoHash范围的"上方"的GeoHash范围的左下角
            - 此时点A的最近邻点为点C，而不是GeoHash值相同的点B
    - 解决：使用八邻域的GeoHash值进行查询匹配
### 缓存查询结果
- 场景：A区域内的多个用户不断发送位置信息请求其附近的数据点
- 暴力法：对每一次请求都对其进行缓冲区查询
    - 重复计算，性能浪费
- 解决
    - 由于这些用户的GeoHash字符串都是相同的，所以可以把该GeoHash当作key，把该区域的数据点当作value来进行缓存，进行共用(空间换时间)
- 存在问题
    - 单个GeoHash范围无法确保查询结果的正确性
        - .eg：该范围的用户A在左上角，用户B在右下角，他们的查询结果虽然一致，但是不符合正常情况(数据不完整)
    - 解决：不使用A和B的单个GeoHash范围，而是使用其父级八邻域GeoHash进行查询匹配
### 数据安全性
- 同一个矩形区域内的所有点的GeoHash值都相同，隐藏了实际的经纬度坐标
### 指定方向的最近邻查询
### 八邻域查询
### BBox查询
## 如何实现GeoHash编码encode
### 步骤
1. 确定GeoHash字符串的长度
2. 经度转二进制
3. 纬度转二进制
4. 经度二进制、纬度二进制组合为经纬度二进制
5. 经纬度二进制转Base32编码
### 确定GeoHash字符串的长度
- 在对经纬度进行递归二分时，每次二分，矩形一个方向上的边长就会减半，矩形区域就越小，精度就越高
    - 即GeoHash编码长度越长，精度越高
- .eg 根据需求，需要6位的GeoHash字符串
    - 因为二进制转Base32编码，2的x次方为32，解得x=5
    - 所以6位的GeoHash字符串需要6*5=30bit位的经纬度二进制
    - 所以需要30/2=15bit位的经度二进制、30/2=15bit位的纬度二进制
### 经度转二进制
- .eg 经纬度[100,50]
1. [-180,180]二分为[-180,0]、[0,180],判断经度在哪个区间，若在前者，二进制的bit位为0，若在后者，二进制的bit位为1
    - 1
2. [0,180]二分为[0,90]、[90,180],同理判断
    - 11
3. [90,180]二分为[90,135]、[135,180],同理判断
    - 110
4. [90,135]二分为[90,112.5]、[112.5,135],同理判断
    - 1100
5. ...继续划分，直到得到15bit位的经度二进制
### 纬度转二进制
- .eg 经纬度[100,50]
1. [-90,90]二分为[-90,0]、[0,90],判断纬度在哪个区间，若在前者，二进制的bit位为0，若在后者，二进制的bit位为1
2. ...同理
3. ...继续划分，直到得到15bit位的纬度二进制
### 经度二进制、纬度二进制组合为经纬度二进制
- 偶数位放经度，奇数位放纬度，把两串编码组合生成新编码
    - 经纬经纬...
### 经纬度二进制转Base32编码
- 30bit位经纬度二进制，五个bit为一组，分别转为十进制，得到六个十进制数值
- 根据如下十进制数值与Base32编码的[码表](https://en.wikipedia.org/wiki/Geohash#Typical_and_main_usages)，将六个十进制数值转为六个Base32编码，组合起来就是六位的GeoHash编码
## 参考
- [wiki/Geohash](https://en.wikipedia.org/wiki/Geohash)
- [在线转换](http://geohash.org/)
- [GeoHash 技术原理及应用实战](https://zhuanlan.zhihu.com/p/645078866)
- [GeoHash核心原理解析](https://www.cnblogs.com/LBSer/p/3310455.html)
- [高效的空间索引算法——Geohash 和 Google S2](https://blog.csdn.net/AndersonHuang/article/details/134273121)
### 开源库
- [node-geohash](https://github.com/sunng87/node-geohash)
- [可视化GeoHash](https://github.com/missinglink/leaflet-spatial-prefix-tree)
