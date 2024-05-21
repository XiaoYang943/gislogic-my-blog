---
title: KD树
category:
  - GIS
  - 空间索引
  - KD树
---
## KD树
### 是什么
- 多维空间分割树、K维搜索二叉树(k-dimension tree)，是对数据点在k维空间中划分的一种数据结构
### 什么用
- 多维空间数据的搜索
  - 范围搜索
  - 最近邻搜索
### 构建kD树
- 结点结构体伪码
```
class Node{
    数据 data;    ?
    空间 range;   该结点代表的空间范围
    整数 Split;   垂直于分割超平面的方向轴序号
    KD-Tree Left;   由位于该结点分割超平面左子空间内所有数据点所构成的KD树
    KD-Tree Right;  由位于该结点分割超平面右子空间内所有数据点所构成的KD树
    KD-Tree parent; 该结点的父节点
}
```