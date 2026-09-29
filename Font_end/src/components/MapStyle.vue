<script setup>
import {ref} from 'vue'
import {useMapStore} from "@/stores/mapStore.js"
import * as Cesium from 'cesium'
import {useToolStore} from "@/stores/toolStore.js";
import {storeToRefs} from "pinia";

const radio = ref('Imagery')
const styleList = ref([
  {type: 'Imagery', name: '影像图'},
  {type: 'Light', name: '亮色系'},
  {type: 'Gray', name: '暗色系'}
])

const {viewer} = useMapStore()
const toolStore = useToolStore()
const {alphaValue, lightValue, contrastValue, saturationValue} = storeToRefs(toolStore)
// 亮色系
const lightProvider = new Cesium.OpenStreetMapImageryProvider({
  url: 'https://tile.openstreetmap.org/'
})
// 暗色系
const grayProvider = new Cesium.UrlTemplateImageryProvider({
  url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
  subdomains: ['a', 'b', 'c', 'd'],
  credit: '© CartoDB'
})
// 修改地图风格
const changeStyle = async (type) => {
  // 先清除所有底图
  viewer.imageryLayers.removeAll()
  alphaValue.value = 100
  contrastValue.value = 100
  saturationValue.value = 100
  lightValue.value = 100
  if (type === 'Imagery') {
    // 遥感影像
    const imageryProvider = await Cesium.ArcGisMapServerImageryProvider.fromUrl(
      "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer")
    viewer.imageryLayers.addImageryProvider(imageryProvider)
  } else if (type === 'Light') {
    viewer.imageryLayers.addImageryProvider(lightProvider)
  } else {
    viewer.imageryLayers.addImageryProvider(grayProvider)
  }
}

</script>

<template>
  <el-sub-menu index="1">
    <template #title>
      <div class="title">
        <img src="@/assets/images/世界地图.png">
        <span>地图风格</span>
      </div>
    </template>
    <div>
      <el-radio-group v-model="radio" size="small" fill="#409eff">
        <el-radio-button @click="changeStyle(style.type)" v-for="style in styleList"
                         :key="style.type" :label="style.name" :value="style.type"/>
      </el-radio-group>
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
</style>
