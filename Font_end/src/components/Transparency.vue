<script setup>
import {ref, watch} from 'vue'
import {storeToRefs} from "pinia"
import {useMapStore} from "@/stores/mapStore.js";
import {useToolStore} from "@/stores/toolStore.js";


const {viewer} = useMapStore()
const toolStore = useToolStore()
const{alphaValue,lightValue,contrastValue,saturationValue}=storeToRefs(toolStore)
// // 透明度：0~100，对应 Cesium alpha 的 0~1
// const alphaValue = ref(100)
//
// // 亮度：0~200，对应 Cesium brightness 的 0~2（100 = 默认值 1.0）
// const lightValue = ref(100)
//
// // 对比度：0~200，对应 Cesium contrast 的 0~2（100 = 默认值 1.0）
// const contrastValue = ref(100)
//
// // 饱和度：0~200，对应 Cesium saturation 的 0~2（100 = 默认值 1.0，0 = 灰度图）
// const saturationValue = ref(100)

watch(alphaValue, (newValue) => {
  viewer.imageryLayers.get(0).alpha = newValue / 100
})

watch(lightValue, (newValue) => {
  viewer.imageryLayers.get(0).brightness = newValue / 100
})

watch(contrastValue, (newValue) => {
  viewer.imageryLayers.get(0).contrast = newValue / 100
})

watch(saturationValue, (newValue) => {
  viewer.imageryLayers.get(0).saturation = newValue / 100
})
</script>

<template>
  <el-sub-menu index="3">
    <template #title>
      <div class="title">
        <img src="@/assets/images/世界地图.png">
        <span>地图样式调整</span>
      </div>
    </template>
    <div>
      <div class="slider-demo-block">
        <span>透明度</span>
        <el-slider size="small" v-model="alphaValue"/>
      </div>
      <div class="slider-demo-block">
        <span>亮度</span>
        <el-slider size="small" v-model="lightValue"/>
      </div>
      <div class="slider-demo-block">
        <span>对比度</span>
        <el-slider size="small" v-model="contrastValue"/>
      </div>
      <div class="slider-demo-block">
        <span>饱和度</span>
        <el-slider size="small" v-model="saturationValue"/>
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

.slider-demo-block {
  padding: 0px 15px 2px 10px;
  max-width: 600px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  font-weight: bold;
}

.slider-demo-block .el-slider {
  padding: 0 10px;
  width: 100px;

}
</style>
