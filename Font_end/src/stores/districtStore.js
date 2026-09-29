import {defineStore} from 'pinia'
import {ref} from 'vue'
import {getDistrictStats} from "@/hooks/useStats.js";

export const useDistrictStore = defineStore('district', () => {
  const selectCode = ref() // 选中的城市代码
  const selectName = ref()
  const districtStats = ref() //后端返回的区域数据
  //  弹框显示的位置
  const x = ref()
  const y = ref()
  const visible=false

  // 调用接口返回数据
  const selectDistrict = async (code) => {
    districtStats.value = await getDistrictStats(code)
  }
  return {selectCode, districtStats, selectDistrict, selectName,x,y,visible}
})
