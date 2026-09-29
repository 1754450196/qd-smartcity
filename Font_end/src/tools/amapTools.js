import gcoord from "gcoord"
import * as Cesium from 'cesium'
import {useMapStore} from "@/stores/mapStore.js";
import {ElMessage} from 'element-plus'

// 地理编码 地名->经纬度
export const geoCode = async (address) => {
  const res = await fetch(`https://restapi.amap.com/v3/geocode/geo?address=${encodeURIComponent(address)}&key=6e11aafa49eddf036601146568e6eb6f`)
  const data = await res.json();
  // console.log(data)
  if (data.status === '1' && data.geocodes.length > 0) {
    const location = data.geocodes[0].location.split(',')
    return {lon: parseFloat(location[0]), lat: parseFloat(location[1])}
  } else {
    throw new Error('无法搜索到相关位置')
  }
}

//  反地理编码 经纬度 -> 地名
export const reGeoCode = async (location) => {
  const res = await fetch(`https://restapi.amap.com/v3/geocode/regeo?output=json&location=${location[0]},${location[1]}&key=6e11aafa49eddf036601146568e6eb6f&radius=500&extensions=all`)
  const data = await res.json()
  if (data.status === '1' && data.regeocode.pois.length > 0) {
    return data.regeocode.pois
  } else {
    ElMessage({
      message: '附近无法搜索到相关地点',
      type: 'error'
    })
  }
}

//路径规划请求
export const getRoutePlan = async (start, end, navMode) => {
  const res = await fetch(
    `https://restapi.amap.com/v3/direction/${navMode}?origin=${start.lon},${start.lat}&destination=${end.lon},${end.lat}&key=6e11aafa49eddf036601146568e6eb6f`
  )
  const data = await res.json()
  // console.log(data)
  if (data.status === '1' && data.route.paths.length > 0) {
    return data.route.paths[0]
  } else {
    throw new Error('距离较远,建议选择驾车导航')
  }
}

// 位置搜索请求
export const getLocation = async (name) => {
  console.log(11)
  const res = await fetch(`https://restapi.amap.com/v3/place/text?keywords=${name}&city=beijing&offset=20&page=1&key=6e11aafa49eddf036601146568e6eb6f&extensions=all`)
  const data = await res.json()
  if (data.status === '1' && data.pois.length > 0) {
    // 拿第一个元素
    const poi = data.pois[0]
    // 经纬度
    const lon = parseFloat(poi.location.split(',')[0])
    const lat = parseFloat(poi.location.split(',')[1])
    const location = [lon, lat]
console.log(location)
    const name = poi.name  //位置名
    const type = poi.type //类型
    const address = poi.pname + poi.cityname + poi.adname + poi.address //地址
    const pictureURLs = poi.photos.map(item => item.url)  //图片地址
    // console.log(address)
    // console.log(pictureURLs)
    return {
      location: location,
      name: name,
      type: type,
      address: address,
      pictureURLs: pictureURLs,
    }
  } else {
    throw new Error('无法搜索到相关地点')
  }
}


export const searchAddress = async (keyword) => {
  if (!keyword) return []
  const res = await fetch(`https://restapi.amap.com/v3/place/text?keywords=${keyword}&key=6e11aafa49eddf036601146568e6eb6f&extensions=all`)
  const data = await res.json();
  // console.log(data)
  if (data.status === '1' && data.pois.length > 0) {
    return data.pois
  }
}
