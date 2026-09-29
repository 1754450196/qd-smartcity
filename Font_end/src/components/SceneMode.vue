<script setup>
import {useMapStore} from "@/stores/mapStore.js"
import {ref} from 'vue'

const {viewer} = useMapStore()
const sceneModeRadio = ref('3D')
const sceneModeList = [
  {mode: '3D', name: '三维', action: () => viewer.scene.morphTo3D(1.0)},
  {mode: '2D', name: '二维', action: () => viewer.scene.morphTo2D(1.0)},
  {mode: 'CV', name: '2.5维', action: () => viewer.scene.morphToColumbusView(1.0)}
]
</script>

<template>
  <el-sub-menu index="2">
    <template #title>
      <div class="title">
        <img src="@/assets/images/显示模式.png">
        <span>视图模式</span>
      </div>
    </template>
    <div>
      <el-radio-group v-model="sceneModeRadio" size="small" fill="#409eff">
        <el-radio-button @click="item.action()" v-for="item in sceneModeList"
                         :key="item.name" :label="item.name" :value="item.mode"/>
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
el-radio-button{

}
</style>
