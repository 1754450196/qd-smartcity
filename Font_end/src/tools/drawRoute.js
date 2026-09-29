import gcoord from "gcoord"
import * as Cesium from 'cesium'
import {useMapStore} from "@/stores/mapStore.js";

// cesium绘制路径
let routeEntity = null
let startEntity = null
let endEntity = null
export const drawRouteByCesium = (routePolyline, start, end) => {
//   坐标转换:高德 --> WGS84
  /*
  const gaodeCoord = [111.123, 23.324]
  const gps = gcoord.transform(
    gaodeCoord, //当前坐标
    gcoord.GCJ02, //当前坐标系
    gcoord.WGS84 //转换坐标系
  )
  */

  removeEntity()
  const {viewer} = useMapStore()
  let allPositions = []  //用于存储所有坐标

  // 起始点坐标系转换
  const gpsStartCoord = gcoord.transform([start.lon, start.lat], gcoord.GCJ02, gcoord.WGS84)
  const gpsEndCoord = gcoord.transform([end.lon, end.lat], gcoord.GCJ02, gcoord.WGS84)

  routePolyline.forEach(rp => {
    const positions = rp.polyline.split(';')

    positions.forEach(point => {
      const p = point.split(',')
      const lon = parseFloat(p[0])
      const lat = parseFloat(p[1])

      const gpsPosition = gcoord.transform(
        [lon, lat],
        gcoord.GCJ02,
        gcoord.WGS84
      )
      allPositions.push(Cesium.Cartesian3.fromDegrees(gpsPosition[0], gpsPosition[1]))
    })
  })

  // 创建路线实体
  routeEntity = new Cesium.Entity({
    polyline: {
      positions: allPositions,
      material: Cesium.Color.LIGHTSKYBLUE,
      width: 4
    }
  })

  // 创建起始点实体
  startEntity = new Cesium.Entity({
    position: Cesium.Cartesian3.fromDegrees(gpsStartCoord[0], gpsStartCoord[1]),
    billboard: {
      image: '/qidian.png',
      width: 30,
      height: 30,
    }
  })

  endEntity = new Cesium.Entity({
    position: Cesium.Cartesian3.fromDegrees(gpsEndCoord[0], gpsEndCoord[1]),
    billboard: {
      image: '/zhongdian.png',
      width: 30,
      height: 30,
    }
  })
  // 添加实体
  viewer.entities.add(routeEntity)
  viewer.entities.add(startEntity)
  viewer.entities.add(endEntity)
  viewer.flyTo(routeEntity)
}

// 移除实体
export const removeEntity = () => {
  const {viewer} = useMapStore()
  if (routeEntity) {
    viewer.entities.remove(routeEntity)
    routeEntity = null
  }
  if (endEntity) {
    viewer.entities.remove(endEntity)
    endEntity = null
  }
  if (startEntity) {
    viewer.entities.remove(startEntity)
    startEntity = null
  }
}

