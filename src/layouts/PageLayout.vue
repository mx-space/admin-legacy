<template>
  <div class="layout" ref="root">
    <div class="toggle" @click="toggleSideBar" :class="{ active: sidebar }">
      <icon :icon="['fas', 'sliders-h']"></icon>
    </div>
    <header :style="options.noPadding ? 'padding: 0.5rem 0;' : ''">
      <span class="title">{{
        options.title ? options.title : $route.meta.title
      }}</span>
      <div class="btn-container" v-if="$slots.header">
        <slot name="header"></slot>
      </div>
    </header>

    <main @click="handleClick">
      <slot />
    </main>

    <footer>
      <div class="float-btns">
        <slot name="footer" />
      </div>
    </footer>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  computed: {
    ...mapGetters(['sidebar']),
  },
  methods: {
    ...mapActions('app', ['toggleSideBar', 'closeSideBar']),
    handleClick() {
      this.closeSideBar()
    },
  },
  props: {
    options: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  provide() {
    return {
      toTop: () => {
        this.$refs.root.scrollTo({
          left: 0,
          top: 0,
          behavior: 'smooth',
        })
      },
    }
  },
}
</script>
<style lang="scss" scoped>
.layout {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  overflow: auto;
  margin: 0 3rem 0;
  main {
    padding: 0 0.8rem;
  }
  header {
    position: sticky;
    background: rgba($color: #fff, $alpha: 0.3);
    backdrop-filter: blur(5px);
    z-index: 3;
    padding: 3rem 0.8rem 0.5rem;
    border-radius: 0 0 12px 12px;
    top: -1rem;
    display: flex;
    justify-content: space-between;
    margin-bottom: 2.5rem;
    .title {
      font-size: 1.5rem;
      user-select: none;
      align-items: center;
      display: flex;
    }
    .btn-container {
      display: flex;
    }
  }
}
footer {
  margin-bottom: 50px;
}
.toggle {
  display: none;
}

@media (max-width: $small) {
  .layout {
    margin: 0;
    header {
      border-radius: unset;
      .title {
        margin-left: 15px;
      }
    }
    main {
      margin: 0 30px;
    }
  }

  .toggle {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    height: 30px;
    width: 30px;
    z-index: 9;
    padding: 12px;
    border-radius: 0 0 12px 0;
    box-sizing: border-box;
    background: #1188e8;
    color: #fff;
    transition: background 0.5s, left 0.5s;
    &.active {
      background: #25b282;
      left: 175px;
    }
  }
}
.float-btns {
  position: fixed;
  bottom: 3rem;
  right: 3rem;
  display: flex;
  flex-direction: column;
  z-index: 3;
  button {
    z-index: 3;
    box-sizing: border-box;
    width: 2.8em;
    height: 2.8em;
    color: #795548;
    margin-top: 0.5em;
    background: #fff;
    border-radius: 66%;
    transition: transform 0.3s;
    animation: show 0.5s 1.8s both;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1), 0 5px 20px rgba(0, 0, 0, 0.2);
    &:not(:first-child) {
      margin-top: 0.8rem;
    }
  }
}
@keyframes show {
  0% {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}
</style>
