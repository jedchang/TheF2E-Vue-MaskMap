<template>
  <div id="app">
    <loading
      loader="bars"
      color="#3986f7"
      :active.sync="isLoading"
      transition
      name="fade"
    >
      <template slot="default">
        <img
          class="loading-logo"
          src="@/assets/images/mask-map-logo.svg"
          alt=""
          width="80"
        >
        <div class="lds-ellipsis">
          <div />
          <div />
          <div />
          <div />
        </div>
      </template>
    </loading>
    <div
      id="side-menu"
      :class="{ toggle: isToggle === true }"
    >
      <div class="sticky-wrap">
        <h1>
          <div class="logo" />
          <div class="title">
            <span>口罩地圖</span>
            <p>Mask map</p>
          </div>
        </h1>
        <select
          v-model="selected.county"
          name="county"
          class="form-control county"
          @change="selected.town = null"
        >
          <option
            v-for="(item,index) in getCounty"
            :key="index"
            :value="item"
          >
            {{ item }}
          </option>
        </select>
        <select
          v-model="selected.town"
          name="town"
          class="form-control town"
        >
          <option
            value="null"
            disabled
          >
            -- 請選擇 --
          </option>
          <option
            v-for="(item, index) in getTown"
            :key="index"
          >
            {{ item }}
          </option>
        </select>
        <p class="count">
          <fa :icon="['fas', 'clinic-medical']" />
          剩餘口罩藥局 <span> {{ filterMaskCount.length }} </span> / <span class="total">{{ filterPharmacy.length }} </span>家
        </p>
      </div>
      <div class="list-wrap">
        <a
          v-for="item in filterPharmacy"
          :key="item.properties.id"
          href="#"
          class="item"
          @click.prevent="clickPharmacy(item)"
        >
          <h3>{{ item.properties.name }}</h3>
          <p>
            <fa :icon="['fas', 'map-marker-alt']" />
            {{ item.properties.address }}
          </p>
          <p>
            <fa :icon="['fas', 'phone-alt']" />
            {{ item.properties.phone }}
          </p>
          <div class="mask-counts">
            <div
              class="count adult"
              :class="{zero: item.properties.mask_adult === 0}"
            >
              <p>成人口罩</p>
              <h4>{{ item.properties.mask_adult }} <span>片</span></h4>
              <img
                class="icon"
                src="@/assets/images/adult-mask.svg"
                alt=""
              >
              <!-- <i class="material-icons adult-icon">face</i> -->
            </div>
            <div
              class="count child"
              :class="{zero: item.properties.mask_child === 0}"
            >
              <p>兒童口罩</p>
              <h4>{{ item.properties.mask_child }} <span>片</span></h4>
              <!-- <i class="material-icons child-icon">child_care</i> -->
              <img
                class="icon"
                src="@/assets/images/child-mask.svg"
                alt=""
              >
            </div>
          </div>
        </a>
      </div>
      <a
        href="#"
        class="toggle-btn"
        @click.prevent="isToggle = !isToggle"
      >
        <!-- <fa :icon="['fas', 'angle-left']" /> -->
        <!-- <i class="material-icons">code</i> -->
        <i class="material-icons">chevron_left</i>
      </a>
    </div>
    <div
      id="map"
      class="map-container"
    />
  </div>
</template>

<script>


export default {
  name: 'App',
  data() {
    return {
      isLoading: false,
      isToggle: false,
      apiData: [],
      selected: {
        county: '臺北市',
        town: null
      },
      map: null,
      OSMUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    }
  },
  computed: {
    // 選擇縣市
    getCounty() {
      let tmp = this.apiData.map(item => item.properties.county)
      let county = tmp.filter((item, index, array) => {
        return array.indexOf(item) === index && item.trim()
      })
      return county
    },
    // 選擇地區
    getTown() {
      let tmp = this.apiData
        .filter(item => {
          return item.properties.county === this.selected.county
        })
        .map(item => item.properties.town)
      let town = tmp.filter((item, index, array) => {
        return array.indexOf(item) === index
      })
      return town
    },
    // 篩選符合縣市區的藥局
    filterPharmacy() {
      let pharmacyData = this.apiData.filter(item => {
        if (!this.selected.town) {
          return item.properties.county.includes(this.selected.county)
        }
        return (
          item.properties.county.includes(this.selected.county) &&
          item.properties.town.includes(this.selected.town)
        )
      })
      return pharmacyData
    },
    // 篩選符合縣市區的藥局剩餘口罩數量
    // 將上方取得藥局數量來做篩選包含(成人、兒童皆零)數量
    filterMaskCount() {
      return this.filterPharmacy.filter(item => {
        return item.properties.mask_adult || item.properties.mask_child
      })
    }
  },
  mounted() {
    // 初始化地圖
    this.map = this.$utils.map.createMap('map', {
      zoomControl: false
    })
    // 客製化 zoom 到右上方
    L.control
      .zoom({
        position: 'topright'
      })
      .addTo(this.map)
    // 加載 open street map 圖資
    this.$utils.map.createTileLayer(this.map, this.OSMUrl, {
      maxZoom: 19,
      attribution: '© Jed Chang'
    })
    // 設置地圖中心位置, zoom=18
    this.map.setView([25, 121.74739], 8)
    // 獲取資料
    this.getAPI()
  },
  methods: {
    async getAPI() {
      this.isLoading = true
      await this.axios
        .get(
          'https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json'
        )
        .then(res => {
          // 一般是回傳 res.data, 取決於 json 設計格式, 此 API 多一層 features
          this.apiData = res.data.features
          // 將資料加入 makerClusterGroup
          const cluster = this.setMarker(this.apiData)
          this.map.addLayer(cluster)
          this.isLoading = false
          // console.log(res.data.features)
        })
        .catch(err => {
          throw new Error(err)
          // console.log(err)
        })
    },
    // 點選藥局 跳轉到地圖所在的位置
    clickPharmacy(item) {
      const position = [
        item.geometry.coordinates[1],
        item.geometry.coordinates[0]
      ]
      // 移動到指定位置
      // console.log(position);
      this.map.setView(position, 18)
      this.map.flyTo(position, 18)
      // this.map.panTo([item.geometry.coordinates[0],item.geometry.coordinates[1]])

      // 創建 popup
      let popup = this.$utils.map.createPopup({
        maxWidth: 350,
        minWidth: 250,
        className: 'map-popup'
      })
      popup.setLatLng(position).setContent(this.popupContent(item))
      this.map.openPopup(popup)
    },
    // 在地圖上定位 marker
    setMarker(data) {
      const cluster = this.$utils.map.createMakerCluster()
      data.forEach(item => {
        // let colorIcon = this.$utils.map.blueIcon
        const marker = this.$utils.map.createMakerByXY(
          item.geometry.coordinates,
          {
            icon: this.$utils.map.blueIcon
          }
        )
        // 創建 popup
        let popup = this.$utils.map.createPopup({
          maxWidth: 350,
          minWidth: 250,
          className: 'map-popup'
        })
        // 寫入 popup 內容
        popup.setContent(this.popupContent(item))
        // 將 marker 綁定 popup
        // marker.bindPopup(popup)
        marker.bindPopup(popup)
        // 加入 makerClusterGroup
        cluster.addLayer(marker)
      })
      return cluster
    },
    // popup 內容樣式
    popupContent(item) {
      return `
        <h3>${item.properties.name}</h3>
        <p>
          <i class="material-icons">location_on</i>
          ${item.properties.address}
        </p>
        <p>
          <i class="material-icons">call</i>
          ${item.properties.phone}
        </p>
        <div class="mask-counts">
        <div class="count adult ${item.properties.mask_adult ? '' : 'zero'}">
          <p>成人口罩</p>
          <h4>${item.properties.mask_adult}<span>片</span></h4>
          <div class="icon"></div>
        </div>
        <div class="count child ${item.properties.mask_child ? '' : 'zero'}">
          <p>兒童口罩</p>
          <h4>${item.properties.mask_child}<span>片</span></h4>
          <img class="icon" src="@/assets/images/child-mask.svg" alt="">
        </div>
      </div>
      `
    }
  }
}
</script>

<style lang="scss">
// Google Materia icon
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
@import url('https://fonts.googleapis.com/css?family=Roboto:400,500,700,900&display=swap');
// 英文字型 數字
@import url('https://fonts.googleapis.com/css?family=Rubik:400,500,700,900&display=swap');
@import '@/assets/scss/style.scss';
</style>
