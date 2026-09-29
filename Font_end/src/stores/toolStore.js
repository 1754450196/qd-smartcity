import { fa } from 'element-plus/es/locales.mjs';
import {defineStore} from 'pinia'
import {ref} from "vue";

export const useToolStore = defineStore('tool', () => {
  const mapToolShow = ref(false)
  const navigationToolShow = ref(false)
  const searchToolShow = ref(false)
  const drawToolShow = ref(false)
  const searchResultShow = ref(false)
  // 透明度：0~100，对应 Cesium alpha 的 0~1
  const alphaValue = ref(100)

// 亮度：0~200，对应 Cesium brightness 的 0~2（100 = 默认值 1.0）
  const lightValue = ref(100)

// 对比度：0~200，对应 Cesium contrast 的 0~2（100 = 默认值 1.0）
  const contrastValue = ref(100)

// 饱和度：0~200，对应 Cesium saturation 的 0~2（100 = 默认值 1.0，0 = 灰度图）
  const saturationValue = ref(100)

  return {
    mapToolShow,
    navigationToolShow,
    searchToolShow,
    drawToolShow,
    searchResultShow,
    alphaValue,
    lightValue,
    contrastValue,
    saturationValue,
  }
})
