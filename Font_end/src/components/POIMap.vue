<script setup>
// import {loadPOILayer, removePOILayer} from "@/cesium/poiLayer.js";
import {useMapStore} from "@/stores/mapStore.js";
import * as Cesium from 'cesium'

let poiDataSource = null
const poiList = [
  {type: 'hospital', name: '医疗', icon: 'icon-yiyuan'},
  {type: 'school', name: '学校', icon: 'icon-zhuzhai'},
  {type: 'scenic', name: '景点', icon: 'icon-jingdian'},
  {type: 'shopping', name: '购物', icon: 'icon-gouwu'},
  {type: 'clear', name: '清除', icon: 'icon-icon_6'}
]
const selectType = (type) => {
  if (type === 'clear') {
    removePOILayer()
  } else {
    // router.push({
    //   path: '/layercontrol',
    //   query: {type}
    // })
    loadPOILayer(type)
  }
}

const loadPOILayer = async (type) => {

  removePOILayer()
  const {viewer} = useMapStore()
  const poiURL = 'http://localhost:8080/geoserver/QD_SmartCity/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=QD_SmartCity%3A' + type + '&outputFormat=application%2Fjson'

  poiDataSource = await Cesium.GeoJsonDataSource.load(poiURL)
  console.log(poiDataSource)

  await viewer.dataSources.add(poiDataSource)
  // console.log(townGeoJson)
  poiDataSource.entities.values.forEach(entity => {
    entity.billboard = new Cesium.BillboardGraphics({
      show: true,
      image: `/${type}.png`,
      width: 35,
      height: 35,
    })
  })
  // ── 开启聚合 ──
  poiDataSource.clustering.enabled = true
  poiDataSource.clustering.pixelRange = 60       // 多少像素范围内的点会被聚合
  poiDataSource.clustering.minimumClusterSize = 3 // 至少3个点才聚合显示

  // 自定义聚合后的样式（聚合圆圈的外观）
  poiDataSource.clustering.clusterEvent.addEventListener((clusteredEntities, cluster) => {
    cluster.label.show = false
    // cluster.label.pixelOffset=new Cesium.Cartesian2(0,0)
    // cluster.label.text = String(clusteredEntities.length)
    cluster.label.font = '14px sans-serif'
    cluster.label.fillColor = Cesium.Color.WHITE
    cluster.label.style = Cesium.LabelStyle.FILL

    cluster.billboard.show = true
    cluster.billboard.id = cluster.label.id
    cluster.billboard.image = createClusterIcon(clusteredEntities.length)
    cluster.billboard.verticalOrigin = Cesium.VerticalOrigin.CENTER
    cluster.billboard.horizontalOrigin = Cesium.HorizontalOrigin.CENTER
    cluster.billboard.disableDepthTestDistance = Number.POSITIVE_INFINITY

    cluster.point.show = false  // 聚合时隐藏原始点
  })
}
// 用 canvas 动态生成聚合图标（圆圈+数字）
const createClusterIcon = (count) => {
  const canvas = document.createElement('canvas')
  canvas.width = 50
  canvas.height = 50
  const ctx = canvas.getContext('2d')

  // 根据数量决定圆圈大小和颜色
  const radius = count > 50 ? 22 : count > 10 ? 18 : 14
  const color = count > 50 ? '#ff3d6e' : count > 10 ? '#faad14' : '#1990FF'

  ctx.beginPath()
  ctx.arc(25, 25, radius, 0, Math.PI * 2)
  ctx.fillStyle = color + 'cc'  // 半透明
  ctx.fill()
  ctx.strokeStyle = '#fff'
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.fillStyle = '#fff'
  ctx.font = 'bold 14px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(count, 25, 25)

  return canvas.toDataURL()
}

const removePOILayer = () => {
  const {viewer} = useMapStore()
  if (poiDataSource) {
    viewer.dataSources.remove(poiDataSource)
    poiDataSource = null
  }
}


</script>

<template>
  <el-sub-menu index="1">
    <template #title>
      <div class="title">
        <img src="@/assets/images/地图.png">
        <span>设施点分布</span>
      </div>
    </template>
    <div class="popover-w">
      <div v-for="poi in poiList" :key="poi.type" class="popover-w-item"
           @click="selectType(poi.type)">
        <i class="iconfont" :class="poi.icon"></i>
        <span>{{ poi.name }}</span>
      </div>
    </div>
  </el-sub-menu>
</template>

<style scoped>
.title {
  display: flex;
  align-items: center
}

.title img {
  height: 30px;
}

.title span {
  font-size: 16px;
  margin-left: 8px;
  font-weight: bold;
}

.popover-w {
  padding: 10px 0;
  display: flex;
  justify-content: space-around;
}

.popover-w-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0px;
}

.popover-w-item:hover {
  cursor: pointer;
  color: #2e81ef;
  scale: 1.2;
  transition: 0.1s linear all;
}

.popover-w-item i {
  font-size: 20px;
}

.popover-w-item span {
  font-size: 10px;
}
</style>
