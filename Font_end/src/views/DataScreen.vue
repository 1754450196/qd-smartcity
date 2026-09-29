<script setup>
import {nextTick,  onMounted, onUnmounted, ref, watch} from "vue";
import * as echarts from 'echarts'
import {useMapStore} from "@/stores/mapStore.js";
import {
  clearClickHandler, clearHightLight, clearHoverHandler,
  initClickHandler,
  initHoverHandler, loadBoundary, removeBoundary
} from "@/cesium/loadBoundary.js";
import {useDistrictStore} from "@/stores/districtStore.js"


const mapStore = useMapStore()
const districtStore = useDistrictStore()

// 图表容器
const companyContainer = ref()
const yearlyContainer = ref()
const taxContainer = ref()
let panelShow = ref(false)   //控制容器显示隐藏

// POI、企业、税种字段映射
const poiMap = {
  hospital: '医院', school: '学校', scenic: '景点',
  shopping: '购物', restaurant: '餐饮', transport: '交通'
}
const companyMap = {
  finance: '金融业', retail: '零售业', realestate: '房地产',
  tech: '科技互联网', manufacturing: '制造业',
  tourism: '旅游服务', logistics: '物流运输'
}
const taxMap = {
  vat: '增值税', corporate_income: '企业所得税',
  consumption: '消费税', personal_income: '个人所得税', other: '其他'
}

// 图表数据
const poiData = ref([])
const companyData = ref([])
const taxData = ref([])
const yearlyData = ref([])

// 图表
let companyChart = null
let yearlyChart = null
let taxChart = null

// POI分布数量
const imgClass = ref(
  ['yiyuan', 'xuexiao', 'jingdian', 'chaoshi', 'canting', 'chezhan'])
const imgSrc = ref(['医院', '学校', '景点', '超市', '餐厅', '车站'])


onMounted(async () => {
  mapStore.cameraToDegrees(120.187836, 34.60872, 180000.0, 0, -45.0)
  await loadBoundary()
  initClickHandler()
  initHoverHandler()

})

//watch 监听数据变化
watch(() => districtStore.districtStats, async (newVal) => {
    panelShow.value = true
    poiData.value = Object.keys(newVal.poi).map(key => {
      return {
        type: poiMap[key],
        value: newVal.poi[key]
      }
    })
    companyData.value = Object.keys(newVal.company).map(key => {
      return {
        type: companyMap[key],
        value: newVal.company[key]
      }
    })
    taxData.value = Object.keys(newVal.tax).map(key => {
      return {
        type: taxMap[key],
        value: newVal.tax[key]
      }
    })
    yearlyData.value = newVal.yearly
    // 图表渲染
    await nextTick()
    loadCompany()
    loadYearTrend()
    loadTax()

  },
  {
    deep: true
  }
)
// 组件销毁时释放所有图表实例
onUnmounted(() => {
  panelShow.value = false
  // 销毁点击事件
  clearClickHandler()
  clearHoverHandler()
  clearHightLight()
  // companyChart.dispose()
  // yearlyChart.dispose()
  // taxChart.dispose()
  removeBoundary()

})

// 图表渲染函数
// 企业数量模块
const loadCompany = () => {
  if (!companyChart) {
    companyChart = echarts.init(companyContainer.value)
  }
  let echartData = companyData.value
  let attackSourcesColor = [
    new echarts.graphic.LinearGradient(0, 1, 1, 1, [
      {offset: 0, color: 'rgba(254, 69, 97, 0)'},
      {offset: 1, color: 'rgba(254, 69, 97, 1)'},
    ]),
    new echarts.graphic.LinearGradient(0, 1, 1, 1, [
      {offset: 0, color: 'rgba(254, 69, 97, 0)'},
      {offset: 1, color: 'rgba(255, 155, 0, 1)'},
    ]),
    new echarts.graphic.LinearGradient(0, 1, 1, 1, [
      {offset: 0, color: 'rgba(254, 69, 97, 0)'},
      {offset: 1, color: 'rgba(233, 217, 0, 1)'},
    ]),
    new echarts.graphic.LinearGradient(0, 1, 1, 1, [
      {offset: 0, color: 'rgba(0, 245, 255, 0)'},
      {offset: 1, color: 'rgba(0, 245, 255, 1)'},
    ]),
  ];
  let option = {
    tooltip: {
      trigger: 'axis',
      formatter(params) {
        for (var i = 0; i < params.length; i++) {
          return params[i].name + ':' + params[i].data.value + '个';
        }
      },
    },
    grid: {
      containLabel: true,
      bottom: '5%',
      left: '-5%',
      top: '5%',
      right: '3%',
    },
    xAxis: {
      type: 'value',
      axisLabel: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: false,
      },
    },
    yAxis: [
      {
        type: 'category',
        data: echartData.map(item => item.type),
        inverse: true,
        position: 'left',
        axisLabel: {
          fontSize: '18px',
          padding: [-3, 0, 0, 0],
          margin: 18, //刻度标签与轴线之间的距离
          formatter: function (value, index) {
            // if (index < 3) {
            //   return `{img${index}|}`;
            // } else {
            //   return `{b|${index + 1}}`;
            // }
            return `{b|${index + 1}}`;
          },
          rich: {
            b: {
              color: '#fff',
              backgroundColor: 'rgba(0, 165, 232, 0.20)',
              borderWidth: 2,
              width: 23,
              height: 23,
              align: 'center',
              borderRadius: 23,
              fontSize: 12,
            },
          },
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
      },
      {
        type: 'category',
        data: echartData.map(item => item.value),
        inverse: true,
        position: 'right',
        axisLabel: {
          padding: [-3, 0, 0, 0],
          margin: 10, //刻度标签与轴线之间的距离
          formatter: function (value, index) {
            return `{a|${echartData[index].value}}{b|}`;
          },
          rich: {
            a: {
              fontSize: 12,
              color: '#fff',
              padding: [4, 5, 0, 0],
            },
            b: {
              padding: [4, 0, 0, 0],
            }
          },
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
      },
      {
        type: 'category',
        inverse: true,
        position: 'left',
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        data: echartData.map((item) => item.type),
        axisLabel: {
          show: true,
          margin: 0,
          fontSize: 9,
          align: 'top',
          verticalAlign: "bottom",
          padding: [10, 0, 10, 0],
          color: '#fff',
        },
      },
    ],
    series: [
      {
        data: echartData.map((item, i) => {
          let itemStyle = {
            color: i > 3 ? attackSourcesColor[3] : attackSourcesColor[i],
          };
          return {
            value: item.value,
            itemStyle: itemStyle,
          };
        }),
        type: 'bar',
        barWidth: 8,
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(32, 104, 118, 1)',
          borderRadius: 30,
        },
        label: {
          show: true,
          position: 'insideRight',
          distance: -10,
          formatter: (params) => {
            if (params.dataIndex < 3) {
              return `{img${params.dataIndex}|}`;
            } else {
              return `{b|}`;
            }
          },
          rich: {
            b: {
              widht: 18,
              height: 18,
              backgroundColor: {
                image: 'https://img.isqqw.com/profile/upload/2025/03/22/11104437-0ac3-48b6-8332-fa8d2864e81a.png',
                repeat: 'no-repeat'
              },
            },
            img0: {
              width: 18,
              height: 18,
              backgroundColor: {
                image: 'https://img.isqqw.com/profile/upload/2025/03/22/981cded1-d267-446b-b018-0301fcd02d5e.png',
                repeat: 'no-repeat'
              },
            },
            img1: {
              width: 18,
              height: 18,
              backgroundColor: {
                image: 'https://img.isqqw.com/profile/upload/2025/03/22/88b67913-0d40-4421-b762-a1433a17f328.png',
                repeat: 'no-repeat'
              },
            },
            img2: {
              width: 18,
              height: 18,
              backgroundColor: {
                image: 'https://img.isqqw.com/profile/upload/2025/03/22/f5fc74a6-8f84-4da7-a4ee-93bf3880f419.png',
                repeat: 'no-repeat'
              },
            },
          }
        },
      },
    ],
  };
  option && companyChart.setOption(option);
}
// 经济及人口变化趋势模块
const loadYearTrend = () => {
  if (!yearlyChart) {
    yearlyChart = echarts.init(yearlyContainer.value)
  }
  let myData3 = yearlyData.value.map(item => item.year)
  let numA = yearlyData.value.map(item => (item.gdp / 10000).toFixed(2))
  let xse = yearlyData.value.map(item => item.population / 10000)
  let option = {
    // backgroundColor: "#011a38",
    tooltip: {
      show: true,
      trigger: "axis",
      axisPointer: {
        type: "shadow",
        textStyle: {
          color: "#fff",
        },
      },
      textStyle: {
        color: "#fff",
      },
      backgroundColor: "rgba(16, 123, 184, .52)", //设置背景颜色
      confine: true,
    },
    grid: {
      top: "18%",
      left: "4%",
      right: "2%",
      bottom: "4%",
      containLabel: true,
    },
    legend: {
      top: "10%",
      y: "center",
      itemWidth: 14,
      itemHeight: 4,
      itemGap: 10,
      textStyle: {
        fontSize: 10,
        color: "#fff",
        padding: [0, 0, 0, 6],
      },
    },
    xAxis: [
      {
        type: "category",
        axisLine: {
          lineStyle: {
            color: "#fffff",
          },
        },
        splitLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitArea: {
          show: false,
        },
        axisLabel: {
          interval: 0,
          color: "#fff",
        },

        data: myData3,
      },
    ],
    yAxis: [
      {
        type: "value",
        name: "GDP/亿",
        splitNumber: 5,
        nameTextStyle: {
          color: "#fff",
          fontSize: 10,
          align: "center",
          padding: [0, 10, -3, 0],
        },
        axisLabel: {
          formatter: "{value}",
          fontSize: 10,
          color: "#fff",
          lineHeight: 16,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: "rgba(28, 130, 197, .3)",
            type: "dashed",
          },
        },
      },
      {
        name: "人口/万",
        splitNumber: 5,
        type: "value",
        nameTextStyle: {
          color: "#fff",
          fontSize: 10,
          align: "center",
          padding: [0, -20, -3, 0],
        },
        axisLabel: {
          show: true,
          fontSize: 10,
          color: "#fff",
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
      },
    ],
    series: [
      {
        label: {
          show: false,
          position: "top",
          color: "#56C1F8",
          formatter: function (p) {
            return p.value > 0 ? p.value : "";
          },
        },
        name: "GDP",
        type: "bar",
        stack: "总量",
        barMaxWidth: 16,
        barGap: "5%",
        itemStyle: {
          show: true,
          color: new echarts.graphic.LinearGradient(
            0,
            0,
            0,
            1,
            [
              {
                offset: 0,
                color: "#015CC7",
              },
              {
                offset: 1,
                color: "#031E3E",
              },
            ],
            false
          ),
          borderRadius: 8,
        },
        data: numA,
      },
      {
        name: "人口数",
        yAxisIndex: 1,
        type: "line",
        showSymbol: true,
        symbol: "circle",
        smooth: true,
        symbolSize: 5,
        lineStyle: {
          color: "#1BC7FF",
        },
        itemStyle: {
          color: "#1BC7FF",
          borderColor: "rgba(27, 199, 255, 0.30)",
          borderWidth: 6,
          shadowColor: "rgba(27, 199, 255, 0.5)",
          shadowBlur: 6,
          opacity: 1,
        },
        label: {
          show: false,
        },
        data: xse, // 折线图的数据
      },
    ],
  };
  option && yearlyChart.setOption(option);
}
//人口数量模块
const loadTax = () => {
  const taxTotal = taxData.value.reduce((prev, curr) => {
    return prev + curr.value
  }, 0)
  if (!taxChart) {
    taxChart = echarts.init(taxContainer.value)
  }
  let option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'verticle',
      top: '16%',
      left: '70%',
      itemGap: 20,
      textStyle: {
        color: '#fff',
        fontSize: 9,
      }
    },
    series: [
      {
        // name: 'Access From',
        type: 'pie',
        radius: ['40%', '72%'],
        avoidLabelOverlap: false,
        padAngle: 5,
        itemStyle: {
          borderRadius: 10
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 18,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        center: ['37%', '50%'],
        data: taxData.value.map(item => {
          return {value: (item.value / taxTotal * 100).toFixed(2), 'name': item.type}
        })
      }
    ]
  };
  option && taxChart.setOption(option);
}


</script>

<template>
  <!--  左上  -->
  <div class="left-top box" v-show="panelShow">
    <div class="header">
      {{ panelShow ? districtStore.districtStats.info.name : null }}企业数量分布
    </div>
    <div class="panel-lt panel" ref="companyContainer"></div>
  </div>

  <!--  左下  -->
  <div class="left-bottom box" v-show="panelShow">
    <div class="header">{{
        panelShow ? districtStore.districtStats.info.name : null
      }}经济总量及人口变化
    </div>
    <div class="panel-lb panel" ref="yearlyContainer"></div>
  </div>

  <!--  右上  -->
  <div class="right-top box" v-show="panelShow">
    <div class="header">{{
        panelShow ? districtStore.districtStats.info.name : null
      }}基础设施数量分布
    </div>
    <div class="panel-rt panel">
      <div class="item" v-for="(item,index) in poiData" :key="item.type">
        <img :src="`../src/assets/icon/${imgSrc[index]}.png`" alt="" :class="imgClass[index]">
        <p>{{ item.type + item.value + '个' }}</p>
      </div>
    </div>
  </div>

  <!--  右下  -->
  <div class="right-bottom box" v-show="panelShow">
    <div class="header">{{
        panelShow ? districtStore.districtStats.info.name : null
      }}税收比例情况（%）
    </div>
    <div class="panel-rb panel" ref="taxContainer"></div>
  </div>

  <!-- 区域属性框 -->
  <div class="districtProps" v-show="districtStore.visible"
       :style="{left:districtStore.x-35+'px',
       top:districtStore.y-35+'px',}">
    <p>{{ '区域名: ' + districtStore.selectName }}</p>
    <p>{{ '区域代码: ' + districtStore.selectCode }}</p>
  </div>
</template>

<style scoped>
.box {
  z-index: 100;
  position: absolute;
  border-radius: 10px;
  pointer-events: auto;
}

.left-top {
  width: 280px;
  top: 60px;
  left: 5px;
}

.left-bottom {
  width: 280px;
  left: 5px;
  bottom: 35px;
}

.right-top {
  width: 280px;
  right: 5px;
  top: 60px;
  //border: 1px solid red;
}

.right-bottom {
  width: 280px;
  right: 5px;
  bottom: 35px;
}

.header {
  text-align: center;
  font-size: 16px;
  color: #fff;
  height: 25px;
  background-image: url("@/assets/images/chart-item.png");
  background-repeat: no-repeat;
  background-position: 35% center;
  background-size: contain;
}

.panel {
  border-radius: 10px;
  background-image: url("@/assets/images/frame.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-color: rgba(100, 117, 138, 0.06);
}

.panel-lt {
  height: 240px;
}

.panel-lb {
  height: 240px;
}

.panel-rt {
  height: 240px;
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
  gap: 3px 10px;
}

.panel-rb {
  height: 240px;
  //border: 1px solid red;
}

.item {
  text-align: center;
  height: 100px;
  width: 80px;
  //border: 1px solid red;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  p {
    font-size: 12px;
    color: rgb(196, 219, 248);
    margin-bottom: 0px;
    font-weight: bold;
  }
}

.item img {
  margin-bottom: -10px;
  width: 100%;
}

.item img:hover {
  transform: scale(1.2);
  transition: 0.2s linear all;
  cursor: pointer;
}

img.canting {
  width: 88%;
}

.districtProps {
  padding: 0px 5px 0px 5px;
  border-radius: 5px;
  position: absolute;
  background-image: url("@/assets/images/frame.png");
  background-repeat: no-repeat;
  background-size: contain;
  background-color: rgba(92, 158, 239, 0.71);

  p {
    line-height: 5px;
    font-size: 10px;
    color: white;
  }
}
</style>
