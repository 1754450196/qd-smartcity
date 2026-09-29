import http from '@/services/api.js'

// 获取各区数据
export const getDistrictStats =(code) => {
  return http.get(`/api/stats/${code}/stats`).then(res => res.data)
}
