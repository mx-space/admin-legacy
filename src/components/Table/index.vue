<template>
  <div class="table" v-if="data" :class="{ loading: loading }">
    <ps :style="options.style" ref="ps">
      <div class="theader">
        <div class="status_bar">
          <div class="col" style="width: 18px;" v-if="options.showID">#</div>
          <div
            class="col"
            v-for="col in cols"
            :key="col.prop"
            :style="{
              width:
                typeof col.width === 'number' ? col.width + 'px' : col.width,
              flex: col.auto ? '1' : '',
            }"
          >
            {{ col.name }}
          </div>
          <div class="col" v-if="action" :style="{ width: action.width }">
            {{ action.name }}
          </div>
        </div>
      </div>

      <div class="tbody">
        <div class="spin" v-show="loading">
          <svg
            data-v-3363c4d1=""
            viewBox="0 0 1024 1024"
            data-icon="loading"
            width="2em"
            height="2em"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
            class="anticon-spin"
          >
            <path
              d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 0 0-94.3-139.9 437.71 437.71 0 0 0-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"
            ></path>
          </svg>
        </div>
        <div class="row" v-for="(row, i) in data" :key="row._id">
          <div
            class="col"
            v-show="options.showID"
            :style="{ overflow: 'hidden', width: '18px' }"
          >
            {{ i + 1 }}
          </div>
          <div
            class="col"
            :style="{
              width:
                typeof col.width === 'number' ? col.width + 'px' : col.width,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              flex: col.auto ? '1' : '',
            }"
            v-for="col in cols"
            :key="col.prop"
            :title="col.tips ? getObjectPathVal(row, col.prop) : ''"
          >
            <VNode
              :tag="col.tag"
              :attrs="col.options && col.options.attrs"
              :style="col.options && col.options.style"
              :class="col.options && col.options.class"
              :row="row"
            >
              {{ getObjectPathVal(row, col.prop) }}</VNode
            >
          </div>
          <div class="col" v-if="action" :style="{ width: action.width }">
            <slot name="actions" :row="row" />
          </div>
        </div>
      </div>
    </ps>

    <div class="tfooter">
      <div class="page_nav" v-if="page && page.totalPage > 1">
        <div class="page_wrap">
          <div
            class="prev btn"
            :class="{ hide: page.currentPage === 1 }"
            @click="$emit('to', page.currentPage - 1)"
          >
            <icon :icon="['fas', 'chevron-left']"></icon>
          </div>
          <div class="page">
            <span
              v-for="n in pages"
              :key="n"
              class="page_num"
              :class="{ active: n === page.currentPage }"
              @click="$emit('to', n)"
              >{{ n }}</span
            >
          </div>
          <div
            class="next btn"
            :class="{ hide: page.currentPage + 1 > page.totalPage }"
            @click="$emit('to', page.currentPage + 1)"
          >
            <icon :icon="['fas', 'chevron-right']"></icon>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import objectPath from 'object-path'
const VNode = {
  name: 'createTag',
  props: {
    tag: String,
    attrs: Object,
    row: Object,
  },
  data() {
    return {
      refAttr: null,
    }
  },
  created() {
    const { attrs, cls, row } = this.$props

    if (typeof attrs === 'object') {
      const newAttr = Object.fromEntries(
        Object.entries(attrs).map(([key, val]) => {
          if (val.ref && val.prop) {
            return [
              key,
              val.prefix
                ? `${val.prefix}${objectPath.get(row, val.prop)}`
                : objectPath.get(row, val.prop),
            ]
          }
          return [key, val]
        }),
      )
      this.refAttr = newAttr
    }
  },
  render(h) {
    const { tag = 'div', attrs = {}, style } = this.$props
    const options = {
      attrs: this.refAttr || attrs,
    }
    return h(tag, options, this.$slots.default)
  },
}
export default {
  props: {
    data: {
      type: Array,
      required: true,
    },
    cols: {
      type: Array,
      required: true,
    },
    options: {
      type: Object,
      default() {
        return {}
      },
    },
    page: {
      type: Object,
      default() {
        return null
      },
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    VNode,
  },
  mounted() {
    if (this.cols[this.cols.length - 1].actions) {
      const action = this.cols.splice(-1, 1)[0]
      this.action = Object.assign({}, action)
    }

    setTimeout(() => {
      this.pageNav()
    }, 100)
  },
  data() {
    return {
      action: null,
      pages: [],
    }
  },
  methods: {
    pageNav() {
      // 页数大于5的处理
      // 先清空数组
      this.pages.splice(0)
      if (this.page && this.page.totalPage > 5) {
        this.pages.push(...[1, 2, 3, '...', this.page.totalPage])
      } else {
        for (let i = 1; i <= this.page.totalPage; i++) {
          this.pages.push(i)
        }
      }
    },
    getObjectPathVal(obj, path) {
      return objectPath.get(obj, path)
    },
  },
  watch: {
    page: {
      deep: true,
      handler() {
        this.pageNav()
      },
    },
    loading() {
      // console.log(this.$refs.ps)

      this.$refs?.ps.$el.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
    },
  },
}
</script>

<style lang="scss" scoped>
$basic-color: #1188e8;
$common-color: #1187e8c2;
$highlight: #ffcca8;
$table-col-gap: 20px;
.table {
  overflow: auto;

  &.loading .tbody .row {
    opacity: 0.7;
    user-select: none;
  }
}
.table::-webkit-scrollbar {
  height: 5px;
  width: 5px;
}

.table {
  .theader {
    display: inline-block;
    min-width: 100%;
    background: rgba(255, 255, 255, 0.568);
    backdrop-filter: blur(5px);
    position: sticky;
    top: 0;
    z-index: 2;
  }
  .status_bar {
    white-space: nowrap;
    display: inline-block;
    padding: 12px;
    border-bottom: 1px #eee solid;
    color: #909399;
    font-weight: 800;
    width: 100%;
    display: flex;
    box-sizing: border-box;
  }
  .tbody {
    display: inline-block;
    height: calc(100vh - 17rem);
    min-width: 100%;
    position: relative;

    .spin {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: $basic-color;
    }

    .row {
      white-space: nowrap;
      // display: inline-block;
      padding: 12px;
      border-bottom: 1px #eee solid;
      display: flex;
      align-items: center;
      // min-width: 100%;
    }
  }
}
.col {
  display: flex;
  align-items: flex-end;
  margin-right: $table-col-gap;
}

.action_btn {
  margin-right: 12px;
  color: $basic-color;
  transition: color 0.5s;
  cursor: pointer;
}
.action_btn:hover {
  color: $common-color;
}

.tfooter {
  margin-top: 20px;
  padding-bottom: 20px;
}
.page_nav {
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  .page_num.active {
    color: $highlight;
  }
  .page_num,
  .btn {
    transition: color 0.5s;
    margin-right: 30px;
    cursor: pointer;
    color: $basic-color;
    &:hover {
      color: $common-color;
    }
  }

  .page_wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;

    // .page {
    //   width: 15rem;
    // }
  }
}
.hide {
  opacity: 0;
  cursor: unset;
  pointer-events: none;
}

a.title {
  color: $basic-color;
  transition: color 0.5s;
  &:hover {
    color: $highlight;
  }
}
</style>
