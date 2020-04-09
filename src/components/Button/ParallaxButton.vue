<template>
  <a
    ref="parallaxBtn"
    class="parallax-btn pr"
    :data-title="title"
    :class="type"
    :style="{ color: forecolor }"
    @mousemove="move"
    @mouseup="up"
    @mousedown="down"
    @mouseleave="leave"
    @click="$emit('click')"
  ></a>
</template>
<style lang="scss">
.parallax-btn {
  position: relative;
  display: inline-block;
  padding: 0.5rem 1rem;
  cursor: pointer;
  user-select: none;
  text-align: center;
  font-size: 15px;
  font-weight: 400;
  color: #fff;
  font-family: system-ui;
  border-radius: 24px;
  &::before {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    border-radius: 4px;
    background: linear-gradient(135deg, #6e8efb, #a777e3);
    box-shadow: 0 2px 5px rgba(#000, 0.2);
    content: '';
    will-change: transform;
    transform: translateY(var(--ty, 0)) rotateX(var(--rx, 0))
      rotateY(var(--ry, 0)) translateZ(var(--tz, -12px));
    transition: box-shadow 500ms ease, transform 200ms ease;
  }
  &.warning::before {
    background: linear-gradient(135deg, #e67e22, #f1c40f);
  }
  &.danger::before {
    background: linear-gradient(135deg, #e74c3c, #d35400);
  }
  &::after {
    display: inline-block;
    position: relative;
    font-weight: bold;
    content: attr(data-title);
    will-change: transform;
    transform: translateY(var(--ty, 0)) rotateX(var(--rx, 0))
      rotateY(var(--ry, 0));
    transition: transform 200ms ease;
  }
  &:hover {
    color: inherit;
  }
  &:hover::before {
    box-shadow: 0 5px 15px rgba(#000, 0.3);
  }
}
</style>

<script>
export default {
  props: {
    title: {
      type: String,
      default: 'Button',
    },
    type: {
      type: String,
      default: 'normal',
      validator(val) {
        return ['normal', 'warning', 'danger'].includes(val)
      },
    },
    forecolor: {
      type: String,
      default: '#fff',
    },
  },
  mounted() {
    this.btnStyle = this.$refs.parallaxBtn.style
  },
  computed: {
    boundingClientRect() {
      return this.$refs.parallaxBtn.getBoundingClientRect()
    },
  },

  methods: {
    down(e) {
      this.btnStyle.setProperty('--tz', '-25px')
    },
    leave(e) {
      this.btnStyle.setProperty('--ty', '0')
      this.btnStyle.setProperty('--rx', '0')
      this.btnStyle.setProperty('--ry', '0')
    },
    move(e) {
      const x = e.clientX - this.boundingClientRect.left
      const y = e.clientY - this.boundingClientRect.top
      const xc = this.boundingClientRect.width / 2
      const yc = this.boundingClientRect.height / 2
      const dx = x - xc
      const dy = y - yc
      this.btnStyle.setProperty('--rx', `${dy / -1}deg`)
      this.btnStyle.setProperty('--ry', `${dx / 10}deg`)
    },
    up() {
      this.btnStyle.setProperty('--tz', '-12px')
    },
  },
}
</script>
