---
title: Polygon的右手规则
category:
  - GIS
  - 数据质检
---

## Polygon的右手规则
```java
/**
 * 让 Polygon 遵循右手规则
 *
 * @param coordinates
 * @return 防止 Polygon 在一些校验软件中报警告：Polygons and MultiPolygons should follow the right-hand rule
 */
public static List<Coordinate> reversePolygonListToFollowRightHandRule(List<Coordinate> coordinates) {
    int lowestPointIndex = findLowestPointIndex(coordinates);
    boolean b = polygonIsRightHandRule(coordinates, lowestPointIndex);
    if (!b) {
        List<Coordinate> reverse = CollectionUtil.reverse(coordinates);
        return reverse;
    }
    return coordinates;
}
```
### 求 LPI (Lowest Point Index)
```java
/**
 * 求 LPI (Lowest Point Index)，即纬度最小的点的索引，若有两个，则取其中经度最小的点的索引
 *
 * @param coordinates
 * @return LPI
 */
public static int findLowestPointIndex(List<Coordinate> coordinates) {
    if (coordinates == null || coordinates.isEmpty()) {
        return -1;
    }

    // 初始化最低纬度和对应索引
    double minLatitude = Double.MAX_VALUE;
    int minIndex = -1;

    for (int i = 0; i < coordinates.size(); i++) {
        Coordinate coordinate = coordinates.get(i);
        double latitude = coordinate.getY();
        double longitude = coordinate.getX();

        // 如果当前纬度小于已知最低纬度，或者纬度相同但经度更小，则更新索引
        if (latitude < minLatitude || (latitude == minLatitude && longitude < coordinates.get(minIndex).getX())) {
            minLatitude = latitude;
            minIndex = i;
        }
    }

    return minIndex;
}
```
### 判断多边形是否遵循右手规则
```java
/**
 * 判断多边形是否遵循右手规则
 *
 * @param coordinates
 * @param lowestPointIndex LPI
 * @return true: 逆时针(遵循右手规则)。false: 顺时针(不遵循右手规则)
 */
public static boolean polygonIsRightHandRule(List<Coordinate> coordinates, Integer lowestPointIndex) {
    Coordinate lastPoint;
    Coordinate curPoint;
    Coordinate nextPoint;
    // LPI在数组中间的情况
    if (lowestPointIndex == 0) {
        lastPoint = coordinates.get(lowestPointIndex);
        curPoint = coordinates.get(lowestPointIndex + 1);
        nextPoint = coordinates.get(lowestPointIndex + 2);
    } else if (lowestPointIndex == coordinates.size() - 1) {
        // LPI在数组尾部的情况
        lastPoint = coordinates.get(lowestPointIndex - 2);
        curPoint = coordinates.get(lowestPointIndex - 1);
        nextPoint = coordinates.get(lowestPointIndex);
    } else {
        // LPI在数组开头的情况
        lastPoint = coordinates.get(lowestPointIndex - 1);
        curPoint = coordinates.get(lowestPointIndex);
        nextPoint = coordinates.get(lowestPointIndex + 1);
    }

    double x1 = curPoint.getX() - lastPoint.getX();
    double y1 = curPoint.getY() - lastPoint.getY();
    double x2 = nextPoint.getX() - lastPoint.getX();
    double y2 = nextPoint.getY() - lastPoint.getY();
    // 计算向量的叉积
    double crossProduct = x1 * y2 - x2 * y1;

    // 判断是否遵循右手规则
    if (crossProduct > 0) {
        return true;   // 逆时针
    } else if (crossProduct < 0) {
        return false;   // 顺时针
    }
    return false;

}
```