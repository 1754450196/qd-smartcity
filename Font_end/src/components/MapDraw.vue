<script setup>
import { onBeforeUnmount } from 'vue'
import { useToolStore } from "@/stores/toolStore.js"
import { useCesiumDraw } from '@/tools/mapDraw.js'

const drawList = [
  {type: 'point', name: '点', icon: 'icon-dian'},
  {type: 'polyline', name: '线', icon: 'icon-icon-line-graph'},
  {type: 'polygon', name: '面', icon: 'icon-huaduobianxing'},
  {type: 'clear', name: '清除', icon: 'icon-icon_6'}
]
const toolStore = useToolStore()
const { drawType, destroy } = useCesiumDraw()

onBeforeUnmount(() => {
  destroy()
})
</script>

<template>
  <transition name="fade-blur">
  <div class="draw" v-show="toolStore.drawToolShow">
    <div class="popover-w">
      <div v-for="item in drawList" :key="item.type" class="popover-w-item"
           @click="drawType(item.type)">
        <i class="iconfont" :class="item.icon"></i>
        <span>{{ item.name }}</span>
      </div>
    </div>
    <span class="iconfont icon-shouhui close" @click="toolStore.drawToolShow=false"></span>
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

.draw {
  padding-right: 5px;
  position: absolute;
  z-index: 999;
  width: 180px;
  height: 35px;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.68);
  left: 0;
  right: 0;
  top: 69px;
  margin: 0 auto;
  display: flex;
  align-items: center;
}

.popover-w {
  width: 170px;
  /* border: 1px solid red; */
  height: 100%;
  padding: 0px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  scale: 1.1;
  transition: 0.1s linear all;
}

.popover-w-item i {
  font-size: 18px;
}

.popover-w-item span {
  font-size: 9px;
}

.close {
  font-size: 10px
}

.close:hover {
  cursor: pointer;
  color: #666565;
  scale: 1.2;
  transition: 0.1s linear all;
}
</style>
