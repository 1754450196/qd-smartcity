import * as Cesium from 'cesium'
import {useMapStore} from '@/stores/mapStore.js'


export const loadTown = async () => {

  const townURL = 'http://localhost:8080/geoserver/QD_SmartCity/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=QD_SmartCity%3Atown&outputFormat=application%2Fjson'
  const mapStore = useMapStore()

  const townGeoJson = await Cesium.GeoJsonDataSource.load(townURL)
  await mapStore.viewer.dataSources.add(townGeoJson)
  // console.log(townGeoJson)
  townGeoJson.entities.values.forEach(entity => {
    // 去掉气泡图标
    entity.billboard = undefined
    // 设置点样式
    entity.point = new Cesium.PointGraphics({
      color: Cesium.Color.BLUE,
      outlineColor: Cesium.Color.WHITE,
      outlineWidth: 1,
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
      // 根据距离缩放大小
      // NearFarScalar(近距离, 近距离时的缩放, 远距离, 远距离时的缩放)
      scaleByDistance: new Cesium.NearFarScalar(
        1000, 5,   // 距离 1km 时，大小 = pixelSize * 10 = 100px
        500000, 0.5   // 距离 500km 时，大小 = pixelSize * 0.5 = 5px
      ),
      distanceDisplayCondition:new Cesium.DistanceDisplayCondition(1000,300000)
    })
    // 设置标签样式
    entity.label = new Cesium.LabelGraphics({
      text: entity.name,
      font:'12px sans-serif',
      pixelOffset:new Cesium.Cartesian2(0,10),
      // scaleByDistance:new Cesium.NearFarScalar()
      distanceDisplayCondition:new Cesium.DistanceDisplayCondition(1000,300000)
    })
  })
}
