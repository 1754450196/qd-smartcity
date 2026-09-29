<script setup>

import {useToolStore} from "@/stores/toolStore.js";
import MapStyle from "@/components/MapStyle.vue";
import SceneMode from "@/components/SceneMode.vue";
import Transparency from "@/components/Transparency.vue";


const toolStore = useToolStore()


</script>

<template>

  <el-drawer
    v-model="toolStore.mapToolShow"
    direction="rtl"
    size="18%"
    :modal="false"
    :modal-penetrable="true"
    style="opacity: 0.95"
  >

    <template #header>
      <div class="header">
        <img src="@/assets/images/工具箱.png">
        <span>地图工具</span>
      </div>
    </template>

    <template #default>
      <hr style="margin-top: 0px">
      <div class="content">
        <div class="item search" @click="toolStore.searchToolShow=!toolStore.searchToolShow">
          <div class="img"><img src="@/assets/images/查询.png"></div>
          <div class="text">
            <span>位置查询</span>
            <br>
            <span>位置搜索</span>
          </div>
        </div>

        <div class="item navigation"
             @click="toolStore.navigationToolShow=!toolStore.navigationToolShow">
          <div class="img"><img src="@/assets/images/导航.png"></div>
          <div class="text">
            <span>地图导航</span>
            <br>
            <span>地图导航/路径规划</span>
          </div>
        </div>

        <div class="item mapdraw" @click="toolStore.drawToolShow = !toolStore.drawToolShow">
          <div class="img"><img src="@/assets/images/绘图.png"></div>
          <div class="text">
            <span>地图绘制</span>
            <br>
            <span>点/线/面绘制</span>
          </div>
        </div>
      </div>
      <hr style="margin-top: 10px">

      <div class="menu">

        <el-row class="tac">
          <el-col :span="24">
            <el-menu
              default-active="2"
              class="el-menu-vertical-demo"
              :default-openeds="['1', '2', '3']"
            >
              <!--              <POIMap></POIMap>-->
              <!--              <HeatMap></HeatMap>-->
              <MapStyle></MapStyle>
              <SceneMode></SceneMode>
              <Transparency></Transparency>
            </el-menu>


          </el-col>
        </el-row>
      </div>


    </template>

  </el-drawer>

</template>

<style scoped>
:global(.el-drawer__header) {
  margin-bottom: 0 !important;
  padding: 10px 10px 0 10px !important;
}

:global(.el-drawer__body) {
  padding: 10px !important;
}

:global(.el-sub-menu__title) {
  padding: 0 0 0 5px !important;
  line-height: 10px;
}

.header {
  height: 30px;
  //border: 1px solid red;
  display: flex;
  align-items: center;
  gap: 5px;

  img {
    height: 30px;
  }

  span {
    font-size: 18px;
    font-weight: bold;
  }
}

.content {
  //background-color: #2e81ef;
  height: 200px;
  //border: 1px solid blue;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.item {
  padding: 10px;
  display: flex;
  border: 1.5px solid rgba(128, 128, 128, 0.62);
  height: 40px;
  border-radius: 10px;
  align-items: center;
}

.item:hover {
  border-color: rgba(30, 144, 255, 0.94);
  color: rgba(30, 144, 255, 0.94);
  cursor: pointer;
}

.item .text {
  //border: 1px solid greenyellow;
  margin-left: 10px;
  text-align: left;
  line-height: 18px;
}

.item img {
  height: 30px;
}

.item .text span:first-child {
  font-weight: bold;
  font-size: 16px;
}

.item .text span:last-child {
  font-size: 9px;
  color: gray;
}

.menu .title {
  display: flex;
  align-items: center
}

.menu .title img {
  height: 30px;
}

.menu .title span {
  font-size: 16px;
  margin-left: 8px;
  font-weight: bold;
}

</style>
