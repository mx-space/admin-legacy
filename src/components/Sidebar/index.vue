<template>
  <div class="side-bar" :class="{ active: sidebar }">
    <div class="title">
      {{ title }}
    </div>
    <perfect-scrollbar class="items" :suppressScrollX="true">
      <item
        :active="activeItems === index"
        :item="item"
        :index="index"
        v-for="(item, index) in items"
        :key="index"
      />
    </perfect-scrollbar>
    <div class="user">
      <div
        class="block user-select"
        @click="$refs.user.classList.toggle('active')"
      >
        <div class="img">
          <img :src="user.avatar" />
        </div>
        <div class="username">{{ user.name }}</div>
        <div class="dot" style="cursor: pointer">.</div>

        <div class="select-menu" ref="user">
          <div class="i">
            <a
              href="https://github.com/innei"
              target="_blank"
              style="color: currentColor"
            >
              <icon :icon="['fab', 'github']"></icon>
            </a>
          </div>
          <div class="i">
            <a :href="homePage" style="color: currentColor">
              <icon :icon="['fas', 'globe-asia']"></icon>
            </a>
          </div>
          <div class="i" @click="handleLogout">
            <icon :icon="['fas', 'sign-out-alt']"></icon>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mapGetters, mapActions } from 'vuex'
import item from './item.vue'
import { Vue, Component } from 'vue-property-decorator'
import { MenuModel } from '../../utils/build-menus'
import { Getter } from 'vuex-class'
import client from '../../socket'
@Component({
  computed: {
    ...mapGetters({
      user: 'profile',
      items: 'menus',
    }),
    ...mapGetters(['sidebar', 'title']),
    homePage() {
      return process.env.VUE_APP_WEB_URL || 'http://localhost:2323'
    },
  },
  components: {
    item,
  },
  methods: {
    ...mapActions('user', ['clearToken']),
  },
})
export default class SideBar extends Vue {
  name = 'Sidebar'

  @Getter('menus')
  items!: any

  get activeItems() {
    const routePath = this.$route.path
    const menus = this.items as Array<MenuModel>

    return menus.findIndex((item) => {
      const reg = new RegExp('^' + item.path, 'ig')
      return !!routePath.match(reg)
    })
  }
  handleLogout() {
    ;(this as any).clearToken()
    this.$router.push('/login')
    client.socket.close()
  }
}
</script>

<style lang="scss" scoped>
$deepBg: #1681e1;
$shallowbg: #1a9cf3;
$left-margin: 1.5rem;

.side-bar {
  color: #fff;
  height: 100vh;
  position: relative;

  // overflow: hidden;
  > .title {
    height: 6rem;
    display: block;
    display: flex;
    font-family: 'Josefin Sans', sans-serif;
    justify-content: center;
    align-items: center;
    font-size: 1.4rem;
    user-select: none;
    cursor: pointer;
  }

  .items {
    margin-left: $left-margin;
    height: calc(100vh - 12rem);
    box-sizing: border-box;
    overflow: scroll;

    transition: height 0.5s;
    border-radius: 0 0 24px 24px;
  }

  .user {
    position: absolute;
    bottom: 0;
    height: 40px;
    display: flex;
    align-items: center;
    margin: $left-margin;
    background: #13afea;
    border-radius: 12px;
    position: relative;
    .block {
      max-height: 100%;
      width: 100%;
      display: grid;
      grid-template-columns: 50px auto 20px;
      margin: 0.5rem;
      user-select: none;
      * {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .username {
        font-family: 'Josefin Sans', sans-serif;
      }
      .img {
        width: 30px;
        height: 30px;
        overflow: hidden;
        position: relative;
      }
      img {
        max-width: 30px;
        border-radius: 50%;
      }
    }
  }
}

.user-select {
  position: relative;

  .select-menu {
    position: absolute;
    right: -70px;
    top: -27px;
    z-index: 9;
    .i {
      width: 40px;
      height: 40px;
      background: $shallowbg;
      border-radius: 50%;
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: 5px 5px 8px -5px #1188e89c;
      transition: transform 0.2s, background 0.3s;
      transform: scale(0);
      cursor: pointer;
    }
    .i:hover {
      background: $deepBg;
    }
    &.active .i {
      transform: scale(1);
      transition-timing-function: cubic-bezier(0.49, 0.02, 0.73, 1.75);
      transition-duration: 0.5s;
    }
    .i:nth-child(1) {
      top: -40px;
      left: -60px;
    }
    .i:nth-child(2) {
      top: 0;
      transition-delay: 0.15s;
    }
    .i:nth-child(3) {
      top: 40px;
      left: -60px;
      transition-delay: 0.3s;
    }
  }
}
@media (max-width: $small) {
  .side-bar {
    // display: none;
    left: 0;
    width: 175px;
    position: fixed;
    left: 0;
    z-index: 999999999999;
    background: linear-gradient(to bottom, #1188e8, #16aae7);
    transform: translateX(-100%);
    transition: transform 0.5s, box-shadow 0.5s;
    height: 500px;
    border-radius: 0 0 24px 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    &.active {
      box-shadow: 1px 1px 43px -9px #000;
      transform: translateX(0);
    }
    .title {
      padding: 2rem 0;
    }
  }
}
</style>
