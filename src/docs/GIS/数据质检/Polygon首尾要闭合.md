---
title: Polygon首尾要闭合
category:
  - 待归档
  - 数据质检
---
## Polygon首尾要闭合
```java
/**
 * 修复 Polygon 首尾不闭合的情况
 *
 * @param coordinates
 * @return 解决以下报错:java.lang.IllegalArgumentException: Points of LinearRing do not form a closed linestring
 */
public static boolean fixPolygonCoordinates(List<Coordinate> coordinates) {
    if (coordinates.size() == 0) return false;

    Coordinate startCoordinate = coordinates.get(0);
    double startX = startCoordinate.getX();
    double startY = startCoordinate.getY();

    Coordinate endCoordinate = coordinates.get(coordinates.size() - 1);
    double endX = endCoordinate.getX();
    double endY = endCoordinate.getY();

    if (startX != endX || startY != endY) {
        // 非闭合
        coordinates.add(startCoordinate);
        return true;
    } else if (startX == endX && startY == endY) {
        // 闭合
        return true;
    }

    return false;
}
```