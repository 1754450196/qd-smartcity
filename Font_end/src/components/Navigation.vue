<script setup>
import {onUnmounted, ref} from 'vue'
import {ElMessage} from "element-plus";
import {
  geoCode,
  getRoutePlan,
  reGeoCode,
  searchAddress
} from "@/tools/amapTools.js";
import {drawRouteByCesium, removeEntity} from "@/tools/drawRoute.js";
import {useMapStore} from "@/stores/mapStore.js";
import {useToolStore} from "@/stores/toolStore.js";
import * as Cesium from 'cesium'
import gcoord from "gcoord";

// 控制组件显示和隐藏
const toolStore = useToolStore()

const startPoint = ref('')
const endPoint = ref('')
const navMode = ref('walking')

const startAddressList = ref([])
const endAddressList = ref([])
const startLoading = ref(false)
const endLoading = ref(false)

const isSelecting = ref(false)

const gcj02Location = ref([])
const poisList = ref([])
const popoverVisible = ref(false)

// 点击开始导航
const startNav = async () => {
  // 起始点表单校验
  if (!startPoint.value || !endPoint.value) {
    ElMessage({
      message: '请输入起始点位置',
      type: 'warning',
    })
    return
  }
  // 高德地图地理编码获取起始点和终点坐标
  try {
    const startCoord = await geoCode(startPoint.value)
    const endCoord = await geoCode(endPoint.value)
    const routeData = await getRoutePlan(startCoord, endCoord, navMode.value)

    const routePolyline = navMode.value === 'riding' ? routeData.rides : routeData.steps

    console.log(routePolyline)
    // console.log(startCoord, endCoord)
    // cesium绘制路线
    drawRouteByCesium(routePolyline, startCoord, endCoord)

    removeClickHandler()
    isSelecting.value = false

  } catch (error) {
    ElMessage({
      message: error,
      type: 'error'
    })
  }
}

// 设置出行方式
const setMode = (type) => {
  navMode.value = type
}

// 交换起始点和终点值
const changePosition = () => {
  console.log('交换起点和终点值')
  const a = startPoint.value
  startPoint.value = endPoint.value
  endPoint.value = a
}

// 输入时出现地址信息


// 起始点名查询
const queryStartAddress = async (keyword) => {
  startLoading.value = true
  startAddressList.value = await searchAddress(keyword)
  startLoading.value = false
}
// 终点位置查询
const queryEndAddress = async (keyword) => {
  endLoading.value = true
  endAddressList.value = await searchAddress(keyword)
  endLoading.value = false
}

let clickHandle = null
const togglePickMode = async () => {
  isSelecting.value = !isSelecting.value

  if (isSelecting.value) {
    ElMessage({
      message: '请在地图中选择位置',
      type: 'primary'
    })
    if (clickHandle) {
      clickHandle.destroy()
      clickHandle = null
    }
    const {viewer} = useMapStore()
    clickHandle = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    clickHandle.setInputAction(async (e) => {
      //  经纬度坐标
      const cartesian = viewer.scene.pickPosition(e.position)
      if (!cartesian) {
        ElMessage({
          message: '未拾取到坐标',
          type: 'warning',
        })
        return
      }
      const cartographic = Cesium.Cartographic.fromCartesian(cartesian)
      const lon = Cesium.Math.toDegrees(cartographic.longitude)
      const lat = Cesium.Math.toDegrees(cartographic.latitude)
      // 获取位置经纬度
      const clickLocation = [lon, lat]

      // 转换成高德坐标系
      gcj02Location.value = gcoord.transform(clickLocation, gcoord.WGS84, gcoord.GCJ02)
      // console.log(gcj02Location.value)
      // 反地理编码，查找附近地点
      poisList.value = await reGeoCode(gcj02Location.value)
      console.log(poisList)
      popoverVisible.value = poisList.value ? true : false
      poisList.value.forEach(poi => poi.distance = parseInt(poi.distance))
      console.log(poisList.value)
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
  } else {
    removeClickHandler()
    popoverVisible.value = false
  }
}

const removeClickHandler = () => {
  if (clickHandle) {
    clickHandle.destroy()
    clickHandle = null
  }
}

onUnmounted(() => {
  removeClickHandler()
  // 清除实体
  removeEntity()
})
</script>

<template>
  <transition name="slide-left">
  <div class="navigation-box" v-show="toolStore.navigationToolShow">
    <!--顶部标题-->
    <div class="head">
      <i class="iconfont icon-daohang"><span>导 航</span></i>
      <span v-if="isSelecting" @click="togglePickMode()" class="iconfont icon-quxiao"
            title="取消选择"></span>
      <span v-else @click="togglePickMode()" class="iconfont icon-ditudianxuan"
            title="从地图中选择起始点"></span>
      <span class="iconfont icon-icon_6" @click="toolStore.navigationToolShow=false"></span>

    </div>

    <!--起始点输入-->
    <div class="content">
      <div class="position-box">
        <div class="start">
          <i class="iconfont icon-qidian-copy"></i>
          <el-select
            clearable
            :loading="startLoading"
            :remote-method="queryStartAddress"
            v-model="startPoint"
            filterable
            remote
            reserve-keyword
            placeholder="请输入起点"
            style="width: 200px;height:100%"
          >
            <el-option
              v-for="item in startAddressList"
              :key="item.adcode"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </div>
        <div class="end">
          <i class="iconfont icon-zhongdian-copy-copy-copy-copy"></i>
          <el-select
            clearable
            :loading="endLoading"
            :remote-method="queryEndAddress"
            v-model="endPoint"
            filterable
            remote
            reserve-keyword
            placeholder="请输入终点"
            style="width: 200px;height:100%"
          >
            <el-option
              v-for="item in endAddressList"
              :key="item.adcode"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </div>
      </div>
      <div class="change" @click="changePosition()"><i class="iconfont icon-paixufangshi"></i></div>

    </div>

    <span style="font-weight: bold;font-size: 13px">选择导航方式</span>

    <!--出行方式选择-->
    <div class="mode">
      <div class="item walk" :class="{active:navMode==='walking'}" @click="setMode('walking')">
        <i class="iconfont icon-buhang"></i>
        <span>步行</span>
      </div>
      <div class="item ride" :class="{active:navMode==='riding'}" @click="setMode('riding')">
        <i class="iconfont icon-qihang-01"></i>
        <span>骑行</span>
      </div>
      <div class="item drive" :class="{active:navMode==='driving'}" @click="setMode('driving')">
        <i class="iconfont icon-jiache"></i>
        <span>驾车</span>
      </div>
    </div>

    <div class="startNav" @click="startNav()">
      <i class="iconfont icon-daohang"></i>
      <span>开始导航</span>
    </div>

    <transition name="drawer">
      <div v-show="popoverVisible" class="placeList">
        <el-table :data="poisList" style="width: 100%;height: 100%" scrollbar-always-on>
          <!-- @vue-generic {User} -->
          <el-table-column label="地点" width="100" align="center">
            <template #default="scope">
              <div style="display: flex; align-items:center;justify-content: center;">
                <span style="font-size: 11px">{{ scope.row.name }}</span>
              </div>
            </template>
          </el-table-column>
          <!-- @vue-generic {User} -->
          <el-table-column label="距离" width="65" align="center">
            <template #default="scope">
              <div style="display: flex; align-items: center;justify-content: center;">
                <span style="font-size:11px">{{ scope.row.distance + 'm' }}</span>
              </div>
            </template>
          </el-table-column>

          <!-- @vue-generic {User} -->
          <el-table-column label="设置" align="center">
            <template #default="scope">
              <div style="display: flex; justify-content: center; gap: 0px;">
                <el-button
                  size="small"
                  type="success"
                  @click="startPoint = scope.row.name"
                  style="font-size: 9px;width: 28px"
                >
                  起点
                </el-button>
                <el-button
                  size="small"
                  type="danger"
                  @click="endPoint = scope.row.name"
                  style="font-size: 9px;width: 28px"
                >
                  终点
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </transition>
  </div>
</transition>

</template>

<style scoped>
.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.35s ease, opacity 0.3s ease;
}

.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(-120%);
  opacity: 0;
}

.slide-left-enter-to,
.slide-left-leave-from {
  transform: translateX(0);
  opacity: 1;
}

.drawer-enter-active,
.drawer-leave-active {
  transition: max-height 0.35s ease, opacity 0.3s ease, transform 0.35s ease;
  overflow: hidden;
}

.drawer-enter-from,
.drawer-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-12px);
}

.drawer-enter-to,
.drawer-leave-from {
  max-height: 240px;
  opacity: 1;
  transform: translateY(0);
}

.navigation-box {
  padding: 5px 10px;
  border: 1px solid gray;
  background-color: rgb(255, 255, 255);
  border-radius: 10px;
  width: 250px;
  //height: auto;
  position: absolute;
  top: 60px;
  left: 10px;
  z-index: 999;
  pointer-events: auto;
}

.placeList {
  //border:1px solid red;
  max-height: 240px;
  width: 100%;
  height: 240px;
  background-color: #ffffff;

}

.head {
  //border: 1px solid red;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  i {
    font-size: 20px;
    color: #2e81ef;
  }

  span {
    margin-left: 10px;
    color: black;
    font-size: 18px;
    font-weight: bold;
  }

  span.iconfont {
    color: #2e81ef;
  }
}

span.iconfont:hover {
  cursor: pointer;
  scale: 1.2;
  transition: 0.2s all linear;
}

.content {
  height: 80px;
  margin: 10px 0;
  border: 1px solid rgba(102, 101, 101, 0.32);
  border-radius: 10px;
  display: flex;
  justify-content: start;
  //flex-direction: column;
}

.content .position-box {
  width: 85%;
  //height: 100%;
  padding: 0 10px;
  border-radius: 10px;
  background-color: rgba(128, 128, 128, 0.12);
  //border: 1px solid #ee00ff;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.content .start {
  //border: 1px solid blue;

  display: flex;
  align-items: center;

  i {
    margin-right: 10px;
    font-size: 25px;
    color: #42c125;
  }
}

.content .end {
  display: flex;
  align-items: center;

  i {
    margin-right: 10px;
    font-size: 25px;

    color: #ef2828;
  }
}

.content .change {
  margin-left: 0px;
  //border: 1px solid greenyellow;
  //background-color: gray;

  i {
    font-weight: bold;
    line-height: 80px;
    color: #1f1f20;
  }
}

.content .change i:hover {
  color: #0398f4;
  cursor: pointer;
}

.mode {
  margin-top: 5px;
  padding: 1px;
  //border: 1px solid rgba(102, 101, 101, 0.32);
  //background-color: rgba(128, 128, 128, 0.12);
  border-radius: 12px;
  display: flex;
  justify-content: space-around;
}

.item {
  border-radius: 10px;
  border: 1px solid rgba(128, 128, 128, 0.62);
  height: 60px;
  width: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(128, 128, 128, 0.09);

  i {
    font-size: 20px;
  }

  span {
    font-size: 12px;
  }
}

.item:hover {
  border-color: rgba(30, 144, 255, 0.94);
  color: rgba(30, 144, 255, 0.94);
  cursor: pointer;
}

.startNav {
  color: white;
  margin-top: 10px;
  border-radius: 5px;
  background-color: #2e81ef;
  height: 30px;
  width: 100%;
  line-height: 30px;
  text-align: center;

  span {
    font-size: 15px;
    margin-left: 10px;
  }
}

.startNav:hover {
  background-color: #0965c1;
  cursor: pointer;
}

.item.active {
  background-color: rgba(46, 129, 239, 0.89);
  color: white;
}

:deep(.el-select__wrapper) {
  font-size: 10px;
}

:deep(.el-select__selected-item) {
  font-size: 13px;
}


</style>
