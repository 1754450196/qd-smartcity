<script setup>

</script>

<template>

  <div class="overview">
    <div class="head-title">
      <span class="iconfont icon-shuxiantubiao" style="color: #498fef"></span>
      <span>&nbsp;&nbsp;城市概览</span>
    </div>

    <div class="item">
      <span class="iconfont icon-renkouguimo-tedaxingrenkouguimo" style="color: #63bbf3"></span>
      <span>&nbsp;&nbsp;&nbsp;&nbsp;常住人口</span>
      <span>10,342,00</span>
      <span>&nbsp;&nbsp;人</span>
    </div>
    <div class="item">
      <span class="iconfont icon-mianjitu" style="color: #399ce3"></span>
      <span>&nbsp;&nbsp;&nbsp;&nbsp;城市面积</span>
      <span>11,293</span>
      <span>&nbsp;&nbsp;km²</span>
    </div>
    <div class="item">
        <span class="iconfont icon-a-15-zhongshanshi-diqushengchanzongzhishu"
              style="color: #f3bd2c"></span>
      <span>&nbsp;&nbsp;&nbsp;&nbsp;地区生产总值</span>
      <span style="color:yellow;">15,032</span>
      <span>&nbsp;&nbsp;亿元</span>
    </div>
    <div class="item">
      <span class="iconfont icon-_chengshiguanli" style="color:dodgerblue"></span>
      <span>&nbsp;&nbsp;&nbsp;&nbsp;建成区面积</span>
      <span style="color:yellow;">1,256</span>
      <span>&nbsp;&nbsp;km²</span>
    </div>
    <div class="item">
      <span class="iconfont icon-lvdi" style="color: #42c125"></span>
      <span>&nbsp;&nbsp;&nbsp;&nbsp;绿地覆盖率</span>
      <span style="color:yellow;">38.6</span>
      <span>&nbsp;&nbsp;%</span>
    </div>
    <div class="item">
      <span class="iconfont icon-kongqizhiliang" style="color: #4bdfa2"></span>
      <span>&nbsp;&nbsp;&nbsp;&nbsp;空气质量指数</span>
      <span style="color:yellow;">35</span>
      <span>&nbsp;&nbsp;优</span>
    </div>
  </div>

  <div class="warning">
    <div class="head-title">
      <span class="iconfont icon-yujing" style="color: #42c2f6"></span>
      <span>&nbsp;&nbsp;实时预警</span>
    </div>

    <div class="wind">
      <div class="icon"><span class="iconfont icon-dafeng"></span></div>
      <div>
        <p style="font-size: 10px">大风预警</p>
        <p style="font-size: 8px">青岛市气象台发布大风蓝色预警</p>
      </div>
    </div>
    <div class="sea">
      <div class="icon"><span class="iconfont icon-hailangyubao"></span></div>
      <div>
        <p style="font-size: 10px">海浪预警</p>
        <p style="font-size: 8px">黄海北部海域有中到大浪</p>
      </div>
    </div>
  </div>

  <div class="monitor">
    <div class="head-title">
      <span class="iconfont icon-shuxiantubiao" style="color: #498fef"></span>
      <span>&nbsp;&nbsp;实时监测</span>
    </div>

    <div class="content">
      <div class="list list1">

        <div class="monitoritem environment">
          <div class="item-Top">
            <div class="icon" style="margin: 0 20px 0 10px;"><span
              class="iconfont icon-kongqizhiliang"
              style="color: rgba(33,187,234,0.91);font-size: 20px "></span></div>
            <div>
              <p style="font-size: 16px;line-height: 10px">01</p>
              <p style="font-size: 9px;line-height: 5px">环境监测</p>
            </div>
          </div>

          <div class="item-Bottom" style="text-align: center">
            <span style="color: #2edada">35</span>
            <span style="color: #2edada">AQI</span>
            <span style="color: #2edada;font-size: 12px">优</span>
            <br>
            <span style="font-size: 10px">PM2.5: 18ug/m²</span>
          </div>
        </div>

        <div class="monitoritem transition">
          <div class="item-Top">
            <div class="icon" style="margin: 0 20px 0 10px"><span
              class="iconfont icon-qiche"
              style="color: rgba(33,187,234,0.91);font-size: 20px"></span></div>
            <div>
              <p style="font-size: 16px;line-height: 10px">02</p>
              <p style="font-size: 9px;line-height: 5px">交通监测</p>
            </div>
          </div>

          <div class="item-Bottom" style="text-align: center">
            <span style="color: #2edada">68</span>
            <span style="color: #22e649;font-size: 12px">畅通</span>
            <br>
            <span style="font-size: 10px">拥堵指数</span>
          </div>
        </div>
      </div>
      <div class="list list2">
        <div class="monitoritem city">
          <div class="item-Top">
            <div class="icon" style="margin: 0 20px 0 10px"><span
              class="iconfont icon-zhuzhai"
              style="color: rgba(33,187,234,0.91);font-size: 20px"></span></div>
            <div>
              <p style="font-size: 16px;line-height: 10px">03</p>
              <p style="font-size: 9px;line-height: 5px">城市运行</p>
            </div>
          </div>

          <div class="item-Bottom" style="text-align: center">
            <span style="color: #4eec28">正常</span>
            <br>
            <span style="font-size: 10px">运行状态</span>
          </div>
        </div>

        <div class="monitoritem source">
          <div class="item-Top">
            <div class="icon" style="margin: 0 20px 0 10px"><span
              class="iconfont icon-nenghao"
              style="color: rgba(33,187,234,0.91);font-size: 20px"></span></div>
            <div>
              <p style="font-size: 16px;line-height: 10px">04</p>
              <p style="font-size: 9px;line-height: 5px">能源消耗</p>
            </div>
          </div>

          <div class="item-Bottom" style="text-align: center">
            <span style="color: #2edada">23.5</span>
            <span style="color: #2edada;font-size: 10px">万kw·h</span>
            <br>
            <span style="font-size: 10px">今日用电量</span>
          </div>
        </div>
      </div>

      <div class="list list3">
        <div class="monitoritem environment">
          <div class="item-Top">
            <div class="icon" style="margin: 0 20px 0 10px"><span
              class="iconfont icon-shuizhi"
              style="color: rgba(33,187,234,0.91);font-size: 20px"></span></div>
            <div>
              <p style="font-size: 16px;line-height: 10px">05</p>
              <p style="font-size: 9px;line-height: 5px">水务监测</p>
            </div>
          </div>

          <div class="item-Bottom" style="text-align: center">
            <span style="color:#4eec28">良好</span>
            <br>
            <span style="font-size: 10px">供水水质</span>
          </div>
        </div>

        <div class="monitoritem transition">
          <div class="item-Top">
            <div class="icon" style="margin: 0 20px 0 10px"><span
              class="iconfont icon-sharpicons_heart-cross"
              style="color: rgba(33,187,234,0.91);font-size: 20px"></span></div>
            <div>
              <p style="font-size: 16px;line-height: 10px">06</p>
              <p style="font-size: 9px;line-height: 5px">公共安全</p>
            </div>
          </div>

          <div class="item-Bottom" style="text-align: center">
            <span style="color: #4eec28">正常</span>
            <br>
            <span style="font-size: 10px">安全状态</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overview {
  z-index: 999;
  color: white;
  position: absolute;
  top: 75px;
  left: 10px;
  border: 15px solid transparent;
  height: 270px;
  width: 240px;
  border-image: url("@/assets/images/border.png") 30 fill;
  pointer-events: auto;
}

.head-title {
  padding-bottom: 5px;
  border-bottom: 1px solid;
  border-image: linear-gradient(to right, rgba(143, 65, 233, 0), rgba(87, 138, 239, 0.59), rgba(143, 65, 233, 0)) 1;
}

.overview .item {
  padding: 7px 10px 7px 20px;
  border-bottom: 1px solid;
  border-image: linear-gradient(to right, rgba(143, 65, 233, 0), rgba(87, 138, 239, 0.59), rgba(143, 65, 233, 0)) 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item span:nth-child(1) {
  font-size: 19px;
}

.item span:nth-child(2) {
  color: rgb(168, 188, 214);
  font-size: 12px;
}

.item span:nth-child(3) {
  margin-left: auto;
}

.item span:nth-child(4) {
  font-size: 10px;
  color: #78a7c5;
  font-family: PingFangSC-Medium;
}

.warning {
  z-index: 999;
  color: white;
  position: absolute;
  bottom: 70px;
  left: 10px;
  border: 15px solid transparent;
  height: 130px;
  width: 240px;
  border-image: url("@/assets/images/border.png") 30 fill;
  pointer-events: auto;
}

.wind {
  border: 5px solid transparent;
  display: flex;
  align-items: center;
  justify-content: left;
  border-image: url("@/assets/images/frame.png") 30 fill;
}

.sea {
  margin-top: 5px;
  border: 5px solid transparent;
  display: flex;
  align-items: center;
  justify-content: left;
  border-image: url("@/assets/images/frame.png") 30 fill;
}

.wind .icon {
  color: #2e81ef;
  margin: 0 10px 0 15px;
}

.sea .icon {
  color: #2e81ef;
  margin: 0 10px 0 15px;
}

.warning p {
  line-height: 5px;
}

.monitor {
  z-index: 999;
  color: white;
  width: 250px;
  height: 440px;
  position: absolute;
  right: 10px;
  top: 75px;
  border: 15px solid transparent;
  border-image: url("@/assets/images/border.png") 30 fill;
  pointer-events: auto;
}

.monitor .content {
  height: 410px;
  //border: 1px solid red;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.content .list {
  //border: 1px solid blue;
  height: 130px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content .list .monitoritem {
  color: white;
  width: 100px;
  height: 100px;
  border: 10px solid transparent;
  border-image: url("@/assets/images/frame.png") 20 fill;
}

.item-Top {
  padding-bottom: 10px;
  display: flex;
  align-items: center;
  height: 40px;
  border-bottom: 1px solid;
  border-image: linear-gradient(to right, rgba(143, 65, 233, 0), rgba(87, 138, 239, 0.59), rgba(143, 65, 233, 0)) 1;
}

.item-Bottom span {
  margin-right: 10px;
}
</style>
