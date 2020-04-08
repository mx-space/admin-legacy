<template>
  <div class="card" :style="mStyle">
    <div class="con">
      <div class="left" :style="lStyle">
        <slot name="left" />
      </div>
    </div>
    <div class="con">
      <div class="right" :style="rStyle">
        <slot name="right" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    lStyle: String,
    rStyle: String,
    mStyle: String,
  },
}
</script>
<style lang="scss" scoped>
.con {
  height: 100%;
  width: 100%;
  position: relative;
}
.card {
  border-radius: 12px;
  display: grid;
  grid-template-columns: 40% auto;
  background: #f4f4f7;
  color: #020720;
  .left,
  .right {
    padding: 1.118rem;
    // background: url(../../assets/1.svg);
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    background-size: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    box-sizing: border-box;
  }
}
</style>
