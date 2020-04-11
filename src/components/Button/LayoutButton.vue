<template>
  <div class="">
    <div
      class="btn"
      :style="{ background: backcolor, color: forecolor }"
      v-if="device !== 'mobile'"
    >
      <div class="name">
        <div class>{{ name }}</div>
      </div>
      <div class="icon" :style="{ background: backcolor }">
        <icon :icon="icon"></icon>
      </div>
    </div>
    <div v-else>
      <button :style="{ background: backcolor, color: forecolor }">
        <icon :icon="icon"></icon>
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    icon: {
      type: Array,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    backcolor: {
      type: String,
      default: '#1188e8',
    },
    forecolor: String,
  },
  computed: {
    ...mapGetters(['device']),
  },
}
</script>
<style lang="scss" scoped>
.btn {
  background: #1188e8;
  padding: 0.75rem 2rem;
  border-radius: 24px;
  color: #fff;
  user-select: none;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  position: relative;
  margin-right: 12px;
  .name {
    margin-right: 2rem;
  }
  .icon {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 1;
    padding: 1rem;
    font-size: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    filter: brightness(1.1);
    border-radius: 50%;
  }
}

button {
  height: 40px;
  width: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
  color: #fff;
  margin-right: 20px;
}
</style>
