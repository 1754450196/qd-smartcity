<script setup>
import { onMounted, ref } from "vue";

const year = ref(0)
const month = ref()
const day = ref()
const hours = ref()
const minutes = ref()
const seconds = ref()
const updateTime = () => {
  year.value = new Date().getFullYear();
  month.value = new Date().getMonth() + 1;
  day.value = new Date().getDate();
  hours.value = new Date().getHours();
  minutes.value = new Date().getMinutes();
  seconds.value = new Date().getSeconds();
}
onMounted(() => {

  updateTime()
  setInterval(updateTime, 1000)
})
</script>

<template>
  <div class="header">
    <div class="timer">
      <p>{{ year }}-{{ month < 10 ? '0' + month : month }}-{{ day < 10 ? '0' + day : day }}</p>
          <p>
            {{ hours < 10 ? '0' + hours : hours }}:{{ minutes < 10 ? '0' + minutes : minutes }}:{{ seconds < 10 ? '0' +
              seconds : seconds }}</p>
    </div>
    <div class="weather">
      <p>
        <span>青岛市 | </span>
        <span style="color: #ecd856">26℃ &nbsp;</span>
        <span class="iconfont icon-duoyun" style="font-size: 20px"></span>
      </p>
    </div>
    <span style="font-size: 28px;font-family: 微软雅黑">智慧城市——青岛</span>
  </div>
</template>

<style scoped>
.header {
  top: 0;
  position: absolute;
  z-index: 99;
  height: 70px;
  color: aliceblue;
  /* //border: 1px solid red; */
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url("../assets/images/header.png");
  background-repeat: no-repeat;
  background-position: center center;
  background-size: contain;
}

@font-face {
  font-family: digifaw;
  src: url('../assets/font/digifaw.ttf');
}

.timer {
  height: 100%;
  position: absolute;
  top: 10px;
  left: 30px;
  /*border: 1px solid violet;*/
  line-height: 5px;
  font-size: 16px;
  letter-spacing: 2px;
  color: #fff;
  font-family: digifaw, serif;
}

.weather {
  height: 100%;
  position: absolute;
  top: 20px;
  right: 30px;
  /*border: 1px solid violet;*/
  line-height: 5px;
  font-size: 15px;
  letter-spacing: 2px;
  color: #fff;
}
</style>
