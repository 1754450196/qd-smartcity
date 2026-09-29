import { useMapStore } from "@/stores/mapStore.js"
import * as Cesium from "cesium"
import * as turf from "@turf/turf"
import { ElMessage } from "element-plus"

export function useCesiumDraw() {
  // ------------------ 内部状态 ------------------
  let handler = null
  let activePositions = []
  let activeEntity = null
  let currentMousePosition = null
  const drawnEntities = []

  // ------------------ 坐标转换工具 ------------------

  // Cartesian3 -> 经纬度数组 [lon, lat]
  const cartesianToLonLat = (cartesian) => {
    const cartographic = Cesium.Cartographic.fromCartesian(cartesian)
    return [
      Cesium.Math.toDegrees(cartographic.longitude),
      Cesium.Math.toDegrees(cartographic.latitude)
    ]
  }

  // 屏幕坐标 -> 地表 Cartesian3
  const getPositionFromScreen = (windowPosition) => {
    const { viewer } = useMapStore()
    const ray = viewer.camera.getPickRay(windowPosition)
    if (!ray) return null
    const cartesian = viewer.scene.globe.pick(ray, viewer.scene)
    return cartesian || viewer.camera.pickEllipsoid(windowPosition, viewer.scene.globe.ellipsoid)
  }

  // ------------------ 中心点计算 ------------------

  // 线的中心点：沿线长度中点（比顶点平均更准确）
  const getLineCenter = (positions) => {
    if (positions.length < 2) return positions[0]
    const coords = positions.map(cartesianToLonLat)
    const line = turf.lineString(coords)
    const length = turf.length(line, { units: 'kilometers' })
    const midPoint = turf.along(line, length / 2, { units: 'kilometers' })
    const [lon, lat] = midPoint.geometry.coordinates
    return Cesium.Cartesian3.fromDegrees(lon, lat)
  }

  // 面的中心点：质心（对凹多边形也比较稳）
  const getPolygonCenter = (positions) => {
    if (positions.length < 3) return positions[0]
    const coords = positions.map(cartesianToLonLat)
    coords.push(coords[0])
    const polygon = turf.polygon([coords])
    const centroid = turf.centerOfMass(polygon)
    const [lon, lat] = centroid.geometry.coordinates
    return Cesium.Cartesian3.fromDegrees(lon, lat)
  }

  // ------------------ 测量 ------------------

  const formatLength = (positions) => {
    if (positions.length < 2) return '0 m'
    const coords = positions.map(cartesianToLonLat)
    const line = turf.lineString(coords)
    const length = turf.length(line, { units: 'meters' })
    return length > 1000 ? `${(length / 1000).toFixed(2)} km` : `${length.toFixed(2)} m`
  }

  const formatArea = (positions) => {
    if (positions.length < 3) return '0 m²'
    const coords = positions.map(cartesianToLonLat)
    coords.push(coords[0])
    const polygon = turf.polygon([coords])
    const area = turf.area(polygon)
    return area > 1000000 ? `${(area / 1000000).toFixed(2)} km²` : `${area.toFixed(2)} m²`
  }

  // ------------------ 状态清理 ------------------

  const resetActiveDrawing = () => {
    const { viewer } = useMapStore()
    if (activeEntity) {
      viewer.entities.remove(activeEntity)
      activeEntity = null
    }
    activePositions = []
    currentMousePosition = null
  }

  const destroyHandler = () => {
    if (handler) {
      handler.destroy()
      handler = null
    }
  }

  // ------------------ 绘制点 ------------------
  const startDrawPoint = () => {
    const { viewer } = useMapStore()
    destroyHandler()
    handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)

    handler.setInputAction((click) => {
      const position = getPositionFromScreen(click.position)
      if (!position) return

      const entity = viewer.entities.add({
        position,
        point: {
          pixelSize: 12,
          color: Cesium.Color.fromCssColorString('#efc22e'),
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 2,
          disableDepthTestDistance: Number.POSITIVE_INFINITY
        }
      })
      drawnEntities.push(entity)

      const [lon, lat] = cartesianToLonLat(position)
      ElMessage.success(`坐标：${lon.toFixed(6)}, ${lat.toFixed(6)}`)

      destroyHandler()
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
  }

  // ------------------ 绘制线 ------------------
  const startDrawPolyline = () => {
    const { viewer } = useMapStore()
    destroyHandler()
    resetActiveDrawing()
    handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)

    const dynamicPositions = new Cesium.CallbackProperty(() => {
      if (activePositions.length < 1) return []
      return [...activePositions, currentMousePosition].filter(Boolean)
    }, false)

    // 标签位置：实时跟随当前已绘制点+鼠标预览点的中心
    const labelPosition = new Cesium.CallbackProperty(() => {
      const positions = [...activePositions, currentMousePosition].filter(Boolean)
      if (positions.length < 2) return positions[0] || Cesium.Cartesian3.ZERO
      return getLineCenter(positions)
    }, false)

    activeEntity = viewer.entities.add({
      polyline: {
        positions: dynamicPositions,
        width: 3,
        material:Cesium.Color.fromCssColorString('#ef852e'),
        clampToGround: true
      },
      label: {
        text: new Cesium.CallbackProperty(() => {
          const positions = [...activePositions, currentMousePosition].filter(Boolean)
          return formatLength(positions)
        }, false),
        font: '14px sans-serif',
        fillColor: Cesium.Color.WHITE,
        backgroundColor: Cesium.Color.fromCssColorString('#ef852e'),
        showBackground: true,
        pixelOffset: new Cesium.Cartesian2(0, -12),
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        position: labelPosition
      }
    })
    drawnEntities.push(activeEntity)

    handler.setInputAction((click) => {
      const position = getPositionFromScreen(click.position)
      if (!position) return
      activePositions.push(position)
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

    handler.setInputAction((movement) => {
      if (activePositions.length === 0) return
      const position = getPositionFromScreen(movement.endPosition)
      if (position) currentMousePosition = position
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

    handler.setInputAction(() => {
      if (activePositions.length < 2) {
        ElMessage.warning('至少需要两个点才能绘制线')
        resetActiveDrawing()
        destroyHandler()
        return
      }
      const finalPositions = [...activePositions]
      activeEntity.polyline.positions = finalPositions
      activeEntity.label.position = getLineCenter(finalPositions)
      activeEntity.label.text = formatLength(finalPositions)

      ElMessage.success(`线长度：${formatLength(finalPositions)}`)
      activeEntity = null
      activePositions = []
      currentMousePosition = null
      destroyHandler()
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
  }

  // ------------------ 绘制面 ------------------
  const startDrawPolygon = () => {
    const { viewer } = useMapStore()
    destroyHandler()
    resetActiveDrawing()
    handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)

    const dynamicPositions = new Cesium.CallbackProperty(() => {
      if (activePositions.length < 1) return []
      return [...activePositions, currentMousePosition].filter(Boolean)
    }, false)

    // 标签位置：实时跟随当前面的质心
    const labelPosition = new Cesium.CallbackProperty(() => {
      const positions = [...activePositions, currentMousePosition].filter(Boolean)
      if (positions.length < 3) return positions[0] || Cesium.Cartesian3.ZERO
      return getPolygonCenter(positions)
    }, false)

    activeEntity = viewer.entities.add({
      polygon: {
        hierarchy: new Cesium.CallbackProperty(() => {
          const positions = [...activePositions, currentMousePosition].filter(Boolean)
          return new Cesium.PolygonHierarchy(positions)
        }, false),
        material: Cesium.Color.fromCssColorString('#ef852e').withAlpha(0.4),
        outline: true,
        outlineColor: Cesium.Color.fromCssColorString('#ef852e')
      },
      polyline: {
        positions: dynamicPositions,
        width: 2,
        material: Cesium.Color.fromCssColorString('#ef852e')
      },
      label: {
        text: new Cesium.CallbackProperty(() => {
          const positions = [...activePositions, currentMousePosition].filter(Boolean)
          return formatArea(positions)
        }, false),
        font: '14px sans-serif',
        fillColor: Cesium.Color.WHITE,
        backgroundColor: Cesium.Color.fromCssColorString('#ef852e'),
        showBackground: true,
        pixelOffset: new Cesium.Cartesian2(0, 0),
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        position: labelPosition
      }
    })
    drawnEntities.push(activeEntity)

    handler.setInputAction((click) => {
      const position = getPositionFromScreen(click.position)
      if (!position) return
      activePositions.push(position)
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

    handler.setInputAction((movement) => {
      if (activePositions.length === 0) return
      const position = getPositionFromScreen(movement.endPosition)
      if (position) currentMousePosition = position
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

    handler.setInputAction(() => {
      if (activePositions.length < 3) {
        ElMessage.warning('至少需要三个点才能绘制面')
        resetActiveDrawing()
        destroyHandler()
        return
      }
      const finalPositions = [...activePositions]
      activeEntity.polygon.hierarchy = new Cesium.PolygonHierarchy(finalPositions)
      activeEntity.polyline.positions = [...finalPositions, finalPositions[0]]
      activeEntity.label.position = getPolygonCenter(finalPositions)
      activeEntity.label.text = formatArea(finalPositions)

      ElMessage.success(`面面积：${formatArea(finalPositions)}`)
      activeEntity = null
      activePositions = []
      currentMousePosition = null
      destroyHandler()
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
  }

  // ------------------ 清除 ------------------
  const clearAll = () => {
    const { viewer } = useMapStore()
    destroyHandler()
    resetActiveDrawing()
    drawnEntities.forEach(entity => viewer.entities.remove(entity))
    drawnEntities.length = 0
    ElMessage.info('已清除所有绘制内容')
  }

  // ------------------ 入口分发 ------------------
  const drawType = (type) => {
    if (type === 'clear') {
      clearAll()
      return
    }
    if (type === 'point') startDrawPoint()
    else if (type === 'polyline') startDrawPolyline()
    else if (type === 'polygon') startDrawPolygon()
  }

  // 组件卸载时调用，避免残留监听
  const destroy = () => {
    destroyHandler()
    resetActiveDrawing()
  }

  return {
    drawType,
    clearAll,
    destroy
  }
}
