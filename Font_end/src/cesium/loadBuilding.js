import { useMapStore } from "@/stores/mapStore.js"
import * as Cesium from 'cesium'

let buildingPrimitive = null
let preRenderHandler = null

export const loadBuilding = async () => {
  const { viewer } = useMapStore()

  registerTechGlowMaterial()

  const buildingURL = 'http://localhost:8080/geoserver/QD_SmartCity/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=QD_SmartCity%3AQingdao_Buildings1&outputFormat=application%2Fjson'

  const res = await fetch(buildingURL)
  const geojson = await res.json()

  const instances = []

  geojson.features.forEach(feature => {
    const { type, coordinates } = feature.geometry
    const height = feature.properties.Elevation * 2
    if (type !== 'Polygon' && type !== 'MultiPolygon') return

    const polygons = type === 'MultiPolygon' ? coordinates : [coordinates]
    polygons.forEach(polygon => {
      const ring = polygon[0]
      const positions = []
      ring.forEach(p => positions.push(p[0], p[1]))

      const geometry = new Cesium.PolygonGeometry({
        polygonHierarchy: new Cesium.PolygonHierarchy(
          Cesium.Cartesian3.fromDegreesArray(positions)
        ),
        extrudedHeight: height,
        // 必须加上 vertexFormat，否则材质拿不到 st（UV）坐标
        vertexFormat: Cesium.MaterialAppearance.MaterialSupport.ALL.vertexFormat
      })

      const instance = new Cesium.GeometryInstance({ geometry })
      instances.push(instance)
    })
  })

  buildingPrimitive = new Cesium.Primitive({
    geometryInstances: instances,
    appearance: new Cesium.MaterialAppearance({
      material: Cesium.Material.fromType('TechGlow', {
        baseColor: new Cesium.Color(0.05, 0.15, 0.35, 1.0),
        glowColor: Cesium.Color.fromCssColorString('rgba(70,174,234,0.9)'),
        time: 0.0,
      }),
      faceForward: true,
      translucent: true,
    }),
    releaseGeometryInstances: true,
    asynchronous: true,
  })

  viewer.scene.primitives.add(buildingPrimitive)

  // 驱动动画
  let time = 0
  preRenderHandler = viewer.scene.preRender.addEventListener(() => {
    time += 0.02
    if (buildingPrimitive?.appearance?.material?.uniforms) {
      buildingPrimitive.appearance.material.uniforms.time = time
    }
  })
}

function registerTechGlowMaterial() {
  if (Cesium.Material._materialCache._materials['TechGlow']) return

  Cesium.Material._materialCache.addMaterial('TechGlow', {
    fabric: {
      type: 'TechGlow',
      uniforms: {
        baseColor: Cesium.Color.WHITE,
        // glowColor: new Cesium.Color(0.1, 0.6, 1.0, 1.0),
        glowColor: new Cesium.Color(0.1, 0.6, 1.0, 1.0),
        time: 0.0,

      },
      source: `
        czm_material czm_getMaterial(czm_materialInput materialInput) {
          czm_material material = czm_getDefaultMaterial(materialInput);
          float height = materialInput.st.t;
          float pulse = 0.7 + 0.3 * sin(time * 1.5);
          float topGlow = pow(height, 2.0);
          float scanLine = fract(height + time * 0.3);
          float scan = smoothstep(0.0, 0.04, scanLine) * smoothstep(0.1, 0.04, scanLine);
          vec3 color = mix(baseColor.rgb, glowColor.rgb, topGlow * pulse);
          color += glowColor.rgb * scan * 0.8;
          material.diffuse = color;
          material.alpha = 0.85;
          return material;
        }
      `
    },
    translucent: true
  })
}

export const removeBuilding = () => {
  const { viewer } = useMapStore()
  if (buildingPrimitive) {
    viewer.scene.primitives.remove(buildingPrimitive)
    buildingPrimitive = null
  }
  if (preRenderHandler) {
    preRenderHandler()
    preRenderHandler = null
  }
}
