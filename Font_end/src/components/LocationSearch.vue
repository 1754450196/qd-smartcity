<script setup>
import {onMounted, ref} from 'vue'
import {useToolStore} from "@/stores/toolStore.js";
import {getLocation, searchAddress} from "@/tools/amapTools.js";
import {ElMessage} from "element-plus";
import gcoord from "gcoord";
import {useMapStore} from "@/stores/mapStore.js";
import * as Cesium from "cesium";

const searchNameList = ref([])
const toolStore = useToolStore()
const searchName = ref('')

const locationName = ref('')
const locationType = ref('')
const locationAddress = ref('')
const locationPictureUrls = ref([])


// 开始搜索函数
let locationPointEntity = null
const startSearchLocation = async (name) => {
  const {viewer} = useMapStore()
  const toolStore = useToolStore()
  if (!searchName.value) {
    ElMessage({
      message: '请输入起始点位置',
      type: 'warning',
    })
    return
  }
  try {
    removePointEntity()
    // 获取位置对象
    const locationObj = await getLocation(name)
    locationName.value = locationObj.name
    locationType.value = locationObj.type
    locationAddress.value = locationObj.address
    locationPictureUrls.value = locationObj.pictureURLs

    // 经纬度转换成wgs84坐标
    const wgs84Location = gcoord.transform(locationObj.location, gcoord.GCJ02, gcoord.WGS84,)
    console.log(wgs84Location)
    // 创建实体
    locationPointEntity = new Cesium.Entity({
      position: Cesium.Cartesian3.fromDegrees(wgs84Location[0], wgs84Location[1]),
      point: {
        pixelSize: 8,
        color: Cesium.Color.RED,
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 2
      }
    })
    viewer.entities.add(locationPointEntity)

    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(wgs84Location[0], wgs84Location[1], 3500.0)
    });
    toolStore.searchResultShow = true
  } catch (error) {
    ElMessage({
      message: error,
      type: 'error',
    })
  }

}
const removePointEntity = () => {
  const {viewer} = useMapStore()
  if (locationPointEntity) {
    viewer.entities.remove(locationPointEntity)
    locationPointEntity = null
  }
}

const loading = ref(false)
const handleRemoteSearch = async (query) => {
  if (!query) {
    searchNameList.value = [];
    return
  }
  loading.value = true
  const res = await searchAddress(query)
  searchNameList.value = res
  loading.value = false
}
const closeResult = () => {
  removePointEntity()
  toolStore.searchResultShow = false
}

</script>

<template>
  <transition name="fade-blur">
    <div class="searchContainer" v-show="toolStore.searchToolShow">
      <el-select
        v-model="searchName"
        clearable
        filterable
        remote
        reserve-keyword
        :remote-method="handleRemoteSearch"
        :loading="loading"
        placeholder="请输入名称"
        style="width: 120px;height:30px;color: white"
      >
        <el-option
          v-for="item in searchNameList"
          :key="item.adcode"
          :label="item.name"
          :value="item.name"
        />
      </el-select>
      <div class="icon"><span @click="startSearchLocation(searchName)"
                              class="iconfont icon-sousuo"></span>
      </div>
    </div>
  </transition>

  <transition name="fade-blur">
    <div class="searchResult" v-show="toolStore.searchResultShow">
      <div class="info">
        <div class="title">
          <div class="name">
            <img src="@/assets/images/名称.png" alt="" style="height: 24px">
            <span style="margin-left: 10px">{{ locationName }}</span>
          </div>
          <img class="close" src="@/assets/images/关闭.png" alt=""
               @click="closeResult">
        </div>

        <div class="type">
          <img src="@/assets/images/类型.png" alt="" style="height: 15px;margin-left: 5px">
          <span style="margin-left: 10px">{{ locationType }}</span>
        </div>
        <div class="address">
          <img src="@/assets/images/地址.png" alt="" style="height: 18px;margin-left: 3px">
          <span style="margin-left: 10px">{{ locationAddress }}</span>
        </div>
      </div>

      <div class="pictureContainer">
        <div class="block text-center">
          <el-carousel v-if="locationPictureUrls.length" height="200px">
            <el-carousel-item v-for="(item,index) in locationPictureUrls" :key="index">
              <img :src="item" alt="" style="height: 100%;width: 100%">
            </el-carousel-item>
          </el-carousel>
          <el-empty v-else description="暂无图片" class="empty-placeholder"/>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.fade-blur-enter-active,
.fade-blur-leave-active {
  transition: opacity 0.2s ease, filter 0.2s ease, transform 0.2s ease;
}

.fade-blur-enter-from,
.fade-blur-leave-to {
  opacity: 0;
  filter: blur(4px);
  transform: scale(0.96);
}

.fade-blur-enter-to,
.fade-blur-leave-from {
  opacity: 1;
  filter: blur(0);
  transform: scale(1);
}

.searchContainer {
  //border: 1px solid red;
  height: 30px;
  display: flex;
  position: absolute;
  top: 70px;
  right: 300px;
  z-index: 999;
  align-content: center;
}

.icon {
  background-color: #498dec;
  height: 32px;
  border-radius: 5px;
  width: 30px;
  color: white;
  margin-left: 1px;
  line-height: 32px;
  text-align: center;
}

.icon:hover {
  background-color: #377ded;
  cursor: pointer;
}

:deep(.el-select__selected-item) {
  font-size: 11px;
}

.searchResult {
  border-radius: 10px;
  background-color: #fff;
  border: 1.5px solid rgba(128, 128, 128, 0.75);
  padding: 10px 15px;
  //height: 300px;
  width: 240px;
  position: absolute;
  z-index: 999;
  right: 20px;
  top: 70px;
}

.name {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
}

.title {
  //border: 1px solid red;
  display: flex;
}

.close {
  margin-left: auto;
  height: 20px;
}

.close:hover {
  scale: 1.2;
  transition: 0.1s linear all;
  cursor: pointer;
}

.type {
  margin-top: 8px;
  display: flex;
  align-items: center;
  font-size: 10px;
}

.address {
  margin-top: 8px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: bold;
  //border: 1px solid red;
}

.demonstration {
  color: var(--el-text-color-secondary);
}

.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.empty-placeholder {
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
