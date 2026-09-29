import * as Cesium from 'cesium'
import {useMapStore} from '@/stores/mapStore.js'
import {useDistrictStore} from "@/stores/districtStore.js";

let boundaryDataSource = null
let handler = null
let lastEntity = null
let hoverHandler = null
let lastOutlineColor = null

export const loadBoundary = async () => {
  const {viewer} = useMapStore()
  // 避免重复加载
  if (boundaryDataSource) {
    viewer.dataSources.remove(boundaryDataSource)
    boundaryDataSource = null
  }
  const boundaryURL = 'http://localhost:8080/geoserver/QD_SmartCity/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=QD_SmartCity%3Aboundary&outputFormat=application%2Fjson'
  boundaryDataSource = await Cesium.GeoJsonDataSource.load(boundaryURL)
  await viewer.dataSources.add(boundaryDataSource)

  boundaryDataSource.entities.values.forEach(entity => {
    entity.polygon.material = Cesium.Color.DODGERBLUE.withAlpha(0.6)
    entity.polygon.outlineColor = Cesium.Color.DODGERBLUE.withAlpha(1)
  })
}


// 点击事件
export const initClickHandler = () => {
  const {viewer} = useMapStore()
  const districtStore = useDistrictStore()

  if (handler) {
    handler.destroy()
    handler = null
  }
  // 必须创建 handler，注册点击事件
  handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)

  handler.setInputAction(async (e) => {
    const pickObj = viewer.scene.pick(e.position)
    if (Cesium.defined(pickObj)) {
      if (pickObj.id && pickObj.id instanceof Cesium.Entity) {
        boundaryDataSource.entities.values.forEach(entity => {
          entity.polygon.extrudedHeight = 0
          entity.polygon.outlineColor = Cesium.Color.DODGERBLUE.withAlpha(1)
        })
        pickObj.id.polygon.extrudedHeight = 4000
        pickObj.id.polygon.outlineColor = Cesium.Color.CYAN.withAlpha(0.8)
        districtStore.selectCode = pickObj.id.properties.districtCo.getValue()
        await districtStore.selectDistrict(pickObj.id.properties.districtCo.getValue())
      }
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
  // return handler
}

// 鼠标悬浮事件
export const initHoverHandler = () => {
  const {viewer} = useMapStore()
  const districtStore = useDistrictStore()

  if (hoverHandler) {
    hoverHandler.destroy()
    hoverHandler = null
  }
  // 必须创建 handler，注册点击事件
  hoverHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  hoverHandler.setInputAction((e) => {
    const pickObj = viewer.scene.pick(e.endPosition)
    if (!Cesium.defined(pickObj) || !pickObj.id || !(pickObj.id instanceof Cesium.Entity) || !pickObj.id.polygon) {
      restoreLastEntity(districtStore)
      return
    }
    const entity = pickObj.id
    //   还在同一个实体上，不做重复处理
    if (entity === lastEntity) {
      // 同一个实体，弹框只跟着鼠标移动，不重复取属性
      districtStore.x = e.endPosition.x
      districtStore.y = e.endPosition.y
      districtStore.visible = true
      return
    }
    restoreLastEntity(districtStore)

    // lastExtrudedHeight = entity.polygon.extrudedHeight
    lastOutlineColor = entity.polygon.outlineColor

    // 应用高亮
    // entity.polygon.extrudedHeight = 3000
    entity.polygon.outlineColor = Cesium.Color.CYAN.withAlpha(0.8)
    lastEntity = entity
    districtStore.x = e.endPosition.x
    districtStore.y = e.endPosition.y
    districtStore.selectCode = lastEntity.properties.districtCo.getValue()
    districtStore.selectName = lastEntity.properties.districtNa.getValue()
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
}

const restoreLastEntity = (districtStore) => {
  if (lastEntity) {
    // lastEntity.polygon.extrudedHeight = lastExtrudedHeight
    lastEntity.polygon.outlineColor = lastOutlineColor
  }
  lastEntity = null
  // lastExtrudedHeight = undefined
  lastOutlineColor = null
  districtStore.visible = false

}

// 清理点击事件
export const clearClickHandler = () => {
  if (handler) {
    handler.destroy()
    handler = null
  }
}

//  清理鼠标移动事件
export const clearHoverHandler = () => {
  lastEntity = null
  hoverHandler?.destroy()
  hoverHandler = null
}

//清除高亮
export const clearHightLight = () => {
  boundaryDataSource.entities.values.forEach(entity => {
    entity.polygon.extrudedHeight = 0
    entity.polygon.outlineColor = Cesium.Color.DODGERBLUE.withAlpha(1)
  })
}

// 移除边界元素
export const removeBoundary = () => {
  const {viewer} = useMapStore()
  if (boundaryDataSource) {
    viewer.dataSources.remove(boundaryDataSource)
    boundaryDataSource = null
  }
}
