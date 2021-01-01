<template>
  <div
    class="row-item"
    :class="{ active: active, expand: expand }"
    ref="row-item"
  >
    <div class="item" @click="handleClick">
      <div class="icon">
        <icon :icon="item.icon" v-if="isArray(item.icon)" />
        <object :data="item.icon" type="image/svg+xml" ref="svg" v-else />
      </div>
      <div class="title">{{ item.title }}</div>
      <div v-if="hasChild" style="justify-content: left">
        <div class="down">
          <icon :icon="['fas', 'chevron-down']" />
        </div>
      </div>
    </div>
    <div
      class="insider"
      :style="expand ? 'max-height: ' + height : ''"
      ref="insider"
      v-if="hasChild"
    >
      <item
        :active="activeItems === index ? true : false"
        :item="item"
        :index="index"
        v-for="(item, index) in item.subItems"
        :key="index"
        ref="item"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Item',
  props: {
    active: Boolean,
    item: {
      type: Object,
      required: true,
      validator(val) {
        return (
          typeof val.title === 'string' &&
          (val.icon instanceof Array || typeof val.icon === 'string') &&
          val.icon.length !== 0
        )
      },
    },
    index: Number,
  },
  data() {
    return {
      height: 0,
      activeItems: 0,
      expand: false,
    }
  },
  watch: {
    active(val) {
      if (!val) {
        this.expand = false
      }
    },
  },
  computed: {
    hasChild() {
      return !(
        JSON.stringify(this.item.subItems) === '{}' ||
        this.item.subItems === undefined
      )
    },
  },
  methods: {
    handleClick() {
      if (!this.item.subItems && this.item.fullPath !== this.$route.fullPath) {
        this.$router.push({
          path: this.item.fullPath,
          query: this.item.query,
        })
      } else {
        this.expand = !this.expand
      }
    },
    isArray(arr) {
      return Array.isArray(arr)
    },
  },
  mounted() {
    try {
      this.height =
        [...this.$refs.insider.querySelectorAll('.item')].length * 5 + 'rem'
      // eslint-disable-next-line no-empty
    } catch {}

    this.$refs.svg?.addEventListener('load', function () {
      const doc = this.getSVGDocument()
      const svg = doc.querySelector('svg')
      svg.setAttribute('fill', '#fff')
    })
  },
}
</script>

<style lang="scss" scoped>
.row-item.expand:not(.hide) {
  > .item .down {
    transform: rotate(180deg);
  }
}
.row-item:not(.expand) {
  > .item .down {
    transform: rotate(0) !important;
  }
}
.row-item.active,
.row-item.expand {
  background: rgba(16, 133, 211, 0.5);
}
.row-item {
  transition: background 0.5s;
  border-radius: 24px 0 0 24px;
}
.row-item.hide .insider {
  max-height: 0 !important;
  opacity: 0;
}
.row-item.active:not(.hide) {
  > .item .down {
    transform: rotate(180deg);
  }
}
.insider {
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.5s, opacity 0.5s;
}

.item {
  * {
    font-family: 'Nunito', sans-serif;
  }
  display: grid;
  grid-template-columns: 50px auto 30px;
  padding: 1rem 0 1rem 1rem;
  transition: 0.5s;
  line-height: 1.5;
  user-select: none;
  opacity: 0.8;
  cursor: default;
  > * {
    display: flex;
    align-items: center;
    justify-content: left;
  }

  .down {
    opacity: 0;
    transition: opacity 0.5s, transform 0.5s;
    // transform-origin: 8px 10px;
  }

  &:hover {
    background: #1a9cf3;
    border-radius: 24px 0 0 24px;
    opacity: 1;
    .down {
      opacity: 0.8;
    }
  }
  .icon {
    justify-content: center;
  }
}
</style>
