<script setup>

import { ref } from 'vue'
import router from "@/router/index.js";
import { useMapStore } from "@/stores/mapStore.js";
import { useToolStore } from "@/stores/toolStore.js";

const pageType = ref('home')

const mapStore = useMapStore()
const toolStore = useToolStore()

const setPageJump = (type) => {
  pageType.value = type
  if (type === 'home') {
    router.push('/')
    mapStore.toOriginView()
  } else if (type === 'data') {
    router.push('/datascreen')
  } else {
    router.push('/cityview')
  }
}


</script>

<template>
  <div id="BottomToolsBar">
    <div class="item-list">
      <div class="item home" :class="{ active: pageType === 'home' }" @click="setPageJump('home')">
        <div class="title">
          <span class="iconfont icon-shouye"></span>
          <span> &nbsp;首&nbsp;&nbsp;&nbsp;&nbsp;页</span>
        </div>
        <div class="description">系统首页</div>
      </div>

      <div class="item data" :class="{ active: pageType === 'data' }" @click="setPageJump('data')">
        <div class="title">
          <span class="iconfont icon-dashujupingtai"></span>
          <span>&nbsp;数据中心</span>
        </div>
        <div class="description">数据统计分析</div>
      </div>

      <div class="item city" :class="{ active: pageType === 'city' }" @click="setPageJump('city')">
        <div class="title">
          <span class="iconfont icon-chengshi"></span>
          <span>&nbsp;城市态势</span>
        </div>
        <div class="description">城市态势监测</div>
      </div>

      <div class="item tool" @click="toolStore.mapToolShow = !toolStore.mapToolShow">
        <div class="title">
          <span class="iconfont icon-gongju"></span>
          <span>&nbsp;地图工具</span>
        </div>
        <div class="description">地图操作工具</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#BottomToolsBar {
  z-index: 99;
  height: 80px;
  margin: 0 auto;
  left: 0;
  right: 0;
  width: 90%;
  /* //border: 1px solid red; */
  position: fixed;
  bottom: 0px;
  background-image: url("../assets/images/xzd-header.png");
  background-repeat: no-repeat;
  background-position: center center;
  background-size: contain;
  transform: rotateX(180deg);

  a {
    text-decoration: none;
    color: inherit;
  }
}

.item-list {
  height: 100%;
  display: flex;
  justify-content: center;
  gap: 15px;
  align-items: end;
  //border: 1px solid #00ff22;
  transform: rotateX(180deg);
}

.item {
  border-radius: 10px;
  border: 10px solid transparent;
  height: 35px;
  width: 80px;
  border-image: url("@/assets/images/border.png") 30 fill;
}

.title {
  border-bottom: 2px solid;
  border-image: linear-gradient(to right, rgba(143, 65, 233, 0), rgba(87, 138, 239, 0.59), rgba(143, 65, 233, 0)) 1;
  color: white;
  padding-bottom: 3px;
  height: 20px;
  text-align: center;
  font-size: 15px;
}

.description {
  margin-top: 2px;
  height: 10px;
  font-size: 9px;
  line-height: 10px;
  color: rgba(255, 255, 255, 0.81);
  text-align: center;
  letter-spacing: 2px;
}

.item:hover {
  cursor: pointer;
  transform: scale(1.05);
  transition: 0.2s linear all;
}

.active {
  box-shadow: 0 0 30px #0acbf8;
}
</style>
