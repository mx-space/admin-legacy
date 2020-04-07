<template>
  <div
    class="bubble"
    :style="{ backgroundColor: color }"
    :class="{
      red: type === 'error',
      green: type === 'success',
      yellow: type === 'warning',
    }"
  >
    <div class="content">{{ message }}</div>
    <div class="close" v-if="!!closable" @click="destroy"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      message: '',
      color: '',
      type: '',
      timeout: 3000,
      closable: true,
    }
  },
  methods: {
    destroy(timeout = 0) {
      setTimeout(() => {
        const classes = this.$el.getAttribute('class') || ''
        this.$el.setAttribute('class', classes + ' remove')

        setTimeout(() => {
          ;(this.$el.parentNode as Node).removeChild(this.$el)
          this.$destroy()
        }, 1000)
      }, timeout)
    },
  },
  created() {
    if (!this.closable) {
      this.destroy(this.timeout)
    }
  },
})
</script>

<style lang="scss" scoped>
.bubble {
  color: #fff;
  display: table;
  background: #333;
  border-radius: 3em;
  pointer-events: auto;
  margin: 0 auto 1em auto;
  box-shadow: 0 5px 5px -2px rgba(0, 0, 0, 0.2);
  animation: fade-small-large 0.3s both;
  background-color: #7e7af8;
  font-family: noto sans sc, pingfang sc, hiragino sans gb, microsoft yahei,
    'sans-serif';

  &.remove {
    animation: fade-in-top 0.3s both reverse;
    -webkit-animation: fade-in-top 0.3s both reverse;
  }
  &.red {
    background-image: linear-gradient(
      269deg,
      #f37878 0%,
      #ff4242 100%
    ) !important;
  }
  &.yellow {
    background-image: linear-gradient(
      90deg,
      #f1c40f 0%,
      #f29441 100%
    ) !important;
  }
  &.green {
    background-image: linear-gradient(
      90deg,
      #2ecc71 0%,
      #27ae60 100%
    ) !important;
  }
  .close {
    cursor: pointer;
    border-radius: 0 1em 1em 0;
    transition: background 0.3s;
    &:hover {
      background: rgba(0, 0, 0, 0.1);
    }
    &:after {
      content: '×';
      font: inherit;
    }
  }
  > div {
    padding: 0.5em 1em;
    display: table-cell;
    vertical-align: middle;
  }
}

@keyframes fade-small-large {
  from {
    opacity: 0;
    transform: scale(0.5, 0.5);
  }
  to {
    opacity: 1;
    transform: scale(1, 1);
  }
}
@keyframes fade-in-top {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
