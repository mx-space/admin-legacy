<template>
  <div class="basic-wrap" ref="wrap">
    <Sidebar />
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script>
import Sidebar from '@/components/Sidebar/index.vue'
import buildMenus from '@/utils/build-menus'
import { mapActions } from 'vuex'
export default {
  components: {
    Sidebar,
  },
  methods: {
    ...mapActions('category', ['fetchCategory']),
  },
  async created() {
    if (this.$store.state.app.menus?.length === 0) {
      await this.$store.dispatch(
        'app/initMenus',
        buildMenus(this.$router.options.routes),
      )
    }
    this.fetchCategory()
  },
  mounted() {
    setTimeout(() => {
      this.$refs.wrap.classList.toggle('full')
    }, 1000)
  },
}
</script>
<style lang="scss" scoped>
.basic-wrap.full {
  transform: scale(1);
  border-radius: 0;
  .title .icon {
    display: none;
  }
}
.basic-wrap {
  margin: 0;
  height: 100%;
  width: 100%;
  position: relative;
  transform: scale(0.8);
  background: linear-gradient(to bottom, #1188e8, #16aae7);
  border-radius: 24px;
  display: grid;
  grid-template-columns: 15rem auto;
  box-shadow: 5px 24px 133px rgba(0, 0, 0, 0.3);
  transition: transform 0.5s, border-radius 0.4s 0.1s;
  .content {
    background-color: #fff !important;
    border-radius: 0 24px 24px 0;
    transition: border-radius 0.5s;
    position: relative;
  }
  &.full .content {
    border-radius: 0;
  }
  &.full .items {
    height: calc(100vh - 12.875rem);
  }
}
@media (max-width: $small) {
  .basic-wrap {
    display: flex;
    transform: scale(1);
    .content {
      width: 100%;
      height: 100%;
      border-radius: 24px;
    }
  }
}
</style>
