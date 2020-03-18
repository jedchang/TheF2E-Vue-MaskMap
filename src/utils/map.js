import $L from 'leaflet'
// 沒引入圖磚會缺少
import 'leaflet/dist/leaflet.css'

// leaflet.markercluster
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet.markercluster'

// 解決預設 marker 無法顯示問題
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'
let DefaultIcon = $L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow
  // iconSize: [25, 41],
  // iconAnchor: [12, 11],
  // popupAnchor: [0, 14],
  // shadowSize: [41, 41]
})
$L.Marker.prototype.options.icon = DefaultIcon

// 創建地圖
const createMap = (divId, options) => {
  let map = $L.map(divId, options)
  return map
}

// 創建地圖函數
const createTileLayer = (map, url, options) => {
  let tileLayer = $L.tileLayer(url, options)
  tileLayer.addTo(map)
  return tileLayer
}

// 創建 icon
const createIcon = options => {
  return $L.icon(options)
}

// 通過 [x,y] 座標，創建 Marker
// const createMakerByXY = (map, coordinate, options = {}) => {
//   let marker = $L.marker($L.latLng(coordinate[1], coordinate[0]), options)
//   marker.addTo(map)
//   return marker
// }

// 通過 [x,y] 座標，創建 Marker
const createMakerByXY = (coordinate, options = {}) => {
  let marker = $L.marker($L.latLng(coordinate[1], coordinate[0]), options)
  return marker
}

// 創建 popup
const createPopup = options => {
  let popup = $L.popup(options)
  return popup
}

// 通過陣列創建 latLng
// const createLatlonByArray = coordinate => {
//   let latLng = $L.latLng(coordinate[1], coordinate[0])
//   return latLng
// }

// 創建 makerClusterGroup
const createMakerCluster = () => {
  return $L.markerClusterGroup()
}

// 自定義 icon 樣式
const blueIcon = new $L.icon({
  iconUrl: 'https://images2.imgbox.com/13/62/ytyBrz01_o.png',
  // iconUrl: '../assets/images/marker-icon-blue.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [45, 45],
  iconAnchor: [22, 11],
  popupAnchor: [0, 0]
})

const greyIcon = new $L.icon({
  iconUrl:
    'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png'
})

export default {
  createMap,
  createTileLayer,
  createIcon,
  createMakerByXY,
  createPopup,
  // createLatlonByArray,
  createMakerCluster,
  blueIcon,
  greyIcon
}
