<script setup>
import Header from "@/components/Header.vue";
import BottomTools from "@/components/BottomTools.vue";
import {onMounted, ref} from 'vue'
import {useMapStore} from '@/stores/mapStore.js'
import gcoord from 'gcoord'
import * as Cesium from 'cesium'
import MapTools from "@/components/MapTools.vue";
import Navigation from "@/components/Navigation.vue";
import DistrictSearch from "@/components/LocationSearch.vue";
import MapDraw from "@/components/MapDraw.vue";
import LocationSearch from "@/components/LocationSearch.vue";


// 地图容器
const mapContainer = ref()
const loading = ref()
const mapStore = useMapStore()

onMounted(async () => {
  await mapStore.initViewer(mapContainer.value)
})
</script>

<template>
  <!--  地图容器  -->
  <div ref="mapContainer" id="map"></div>
  <!--  头部标题  -->
  <Header></Header>
  <!--  底部工具栏  -->
  <BottomTools></BottomTools>

  <!--  工具条  -->
  <div>
    <MapTools></MapTools>
    <!--  导航面板  -->
    <Navigation></Navigation>
    <LocationSearch></LocationSearch>
    <MapDraw></MapDraw>
  </div>
  <div>

  </div>

  <!--  路由出口  -->
  <div class="view-layer" v-loading="loading">
    <router-view></router-view>
  </div>

</template>

<style scoped>
#map {
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
}

.view-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  pointer-events: none; /* ← 让鼠标点击穿透到地图 */
}
</style>
