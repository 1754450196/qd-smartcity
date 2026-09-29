import {defineStore} from 'pinia'
import {ref, shallowRef} from "vue";
import * as Cesium from 'cesium'

Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3Yjk4ZDQ0Yy1lZWU0LTRkMzItYjAyZi03NDM4NjgzODgwMWMiLCJpZCI6MTYzMjUyLCJpYXQiOjE3NzcwMTcwNDh9.wPGKN6vEVaq8EuRcUentMeIJZYY9VmEr9IV0fOWx5To'
export const useMapStore = defineStore('map', () => {
  // viewer对象不需要深度响应式，用shallowRef
  const viewer = shallowRef(null)
  const baseLayerReady = ref(false)

  async function initViewer(containerId) {
    viewer.value = new Cesium.Viewer(containerId, {
      infoBox: false,//是否显示搜索框
      geocoder: false, //是否显示查询按钮
      homeButton: false, //是否显示homeButton
      sceneModePicker: false,
      baseLayerPicker: false, //是否显示图层选择器
      imageryProvider:false,
      navigationHelpButton: false, //是否显示帮助按钮
      animation: false, // 是否显示动画播放
      timeline: false, // 是否显示时间轴
      fullscreenButton: false, //是否显示全屏按钮
      selectionIndicator: false,// 关掉绿色圆圈指示器
      terrain: await Cesium.Terrain.fromWorldTerrain({
        requestVertexNormals: true
      })
    })
    viewer.value.cesiumWidget.creditContainer.style.display = "none";//隐藏logo
    viewer.value.scene.msaaSamples = 4
    viewer.value.scene.globe.enableLighting = false
    viewer.value.scene.globe.baseColor = Cesium.Color.fromCssColorString('rgba(26,26,46,0.45)')
    toOriginView()

    const imgProvider = await Cesium.ArcGisMapServerImageryProvider.fromUrl(
      "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer")
    viewer.value.imageryLayers.addImageryProvider(imgProvider)

    // 开启大气层发光效果
    viewer.value.scene.skyAtmosphere.show = true
    viewer.value.scene.globe.showGroundAtmosphere = true
    baseLayerReady.value = true
  }

  // 回到初始位置
  function toOriginView() {
    viewer.value.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(-110, 0, 20000000)
    })
  }

  // 相机飞行到青岛市
  function cameraToDegrees(lon,lat,height,heading,pitch) {
    viewer.value.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(lon,lat,height),
      orientation : {
        heading : Cesium.Math.toRadians(heading),
        pitch : Cesium.Math.toRadians(pitch),
        roll : 0.0
      }
    })
  }

  return {initViewer, viewer, toOriginView, cameraToDegrees,baseLayerReady}
})
