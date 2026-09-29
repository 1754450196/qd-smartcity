<script setup>

</script>

<template>
  <el-sub-menu index="2">
    <template #title>
      <div class="title">
        <img src="@/assets/images/热力图.png">
        <span>专题地图</span>
      </div>
    </template>
    <div>
      <span>医院</span>
      <span>医院</span>
      <span>医院</span>
    </div>
  </el-sub-menu>
</template>

<style scoped>
.title {
  display: flex;
  align-items: center
}

.title img {
  height: 30px;
}

.title span {
  font-size: 16px;
  margin-left: 8px;
  font-weight: bold;
}
</style>
