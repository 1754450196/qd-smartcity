import * as Cesium from 'cesium'
import { useMapStore } from '@/stores/mapStore.js'

let roadPrimitive = null
let preRenderHandler = null

export const loadRoad = async () => {
  const { viewer } = useMapStore()

  createFlowMaterial()

  const roadURL = 'http://localhost:8080/geoserver/QD_SmartCity/ows?' +
    'service=WFS&version=1.0.0&request=GetFeature' +
    '&typeName=QD_SmartCity:road_merge' +
    '&outputFormat=application/json'

  const res = await fetch(roadURL)
  const geojson = await res.json()
  const instances = []

  geojson.features.forEach((feature) => {
    const { type, coordinates } = feature.geometry

    // 兼容 LineString 和 MultiLineString
    const lines = type === 'MultiLineString' ? coordinates : [coordinates]

    lines.forEach((line) => {
      const positions = line.flatMap(c => [c[0], c[1]])

      const polyline = new Cesium.PolylineGeometry({
        positions: Cesium.Cartesian3.fromDegreesArray(positions),
        width: 0.5,
      })

      instances.push(new Cesium.GeometryInstance({ geometry: polyline }))
    })
  })

  roadPrimitive = new Cesium.Primitive({
    geometryInstances: instances,
    appearance: new Cesium.PolylineMaterialAppearance({
      material: Cesium.Material.fromType('RoadFlow', {
        color: Cesium.Color.fromCssColorString('rgba(234,217,69,0.87)'),
        speed: 10.0,
      }),
    }),
    releaseGeometryInstances: true,
    asynchronous: true,
  })

  viewer.scene.primitives.add(roadPrimitive)

  // 统一在这里驱动 time
  let time = 0
  preRenderHandler = viewer.scene.preRender.addEventListener(() => {
    time += 0.01
    if (roadPrimitive?.appearance?.material?.uniforms) {
      roadPrimitive.appearance.material.uniforms.time = time
    }
  })
}

const createFlowMaterial = () => {
  if (Cesium.Material._materialCache._materials['RoadFlow']) return  // 避免重复注册

  Cesium.Material._materialCache.addMaterial('RoadFlow', {
    fabric: {
      type: 'RoadFlow',
      uniforms: {
        color: Cesium.Color.CYAN,
        speed: 10.0,
        time: 0,
      },
      source: `
czm_material czm_getMaterial(czm_materialInput materialInput)
{
  czm_material material = czm_getDefaultMaterial(materialInput);

  vec2 st = materialInput.st;

  // 🔥 渐变颜色（蓝 → 青 → 黄）
  vec3 color1 = vec3(0.25, 0.20, 0.05);
  vec3 color2 = vec3(0.92, 0.85, 0.27);
  vec3 color3 = vec3(1.0, 0.95, 0.6);

  float t = st.s;

  vec3 color;
  if (t < 0.5) {
    color = mix(color1, color2, t * 2.0);
  } else {
    color = mix(color2, color3, (t - 0.5) * 2.0);
  }

  // 🔥 流动效果
  float flow = fract(st.s - time * speed * 0.1);
  float alpha = smoothstep(0.0, 0.2, flow) * (1.0 - smoothstep(0.8, 1.0, flow));

  material.diffuse = color;
  material.alpha = alpha;

  return material;
}
`
    },
    translucent: true  // ← 别忘了这个，否则透明效果不生效
  })
}

export const removeRoad = () => {
  const { viewer } = useMapStore()

  if (roadPrimitive) {
    viewer.scene.primitives.remove(roadPrimitive)
    roadPrimitive = null
  }
  if (preRenderHandler) {
    preRenderHandler()
    preRenderHandler = null
  }
}
