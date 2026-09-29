<script setup>
import {loadBuilding, removeBuilding} from "@/cesium/loadBuilding.js";
import { onMounted, onUnmounted} from "vue";
import {loadRoad, removeRoad} from "@/cesium/loadRoad.js";
import {useMapStore} from "@/stores/mapStore.js";
import {ElLoading} from "element-plus";

const mapStore = useMapStore()

onMounted(async () => {
  const loadingInstance = ElLoading.service({
    text: '数据加载中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  try {
    await Promise.all([loadRoad(), loadBuilding()])
  } finally {
    loadingInstance.close()
    mapStore.cameraToDegrees(120.369836, 36.03872, 2500.0, 0, -35.0)
  }
})

onUnmounted(() => {
  removeRoad()
  removeBuilding()
})
</script>

<template>

</template>

<style scoped>

</style>
