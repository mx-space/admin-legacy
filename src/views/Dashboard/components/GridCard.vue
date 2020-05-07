<template>
  <div class="welcome-card-wrap">
    <div class="grid" :class="{ m: device === 'mobile' }">
      <Card>
        <template #left>
          <div class="bg svg welcome full"></div>
        </template>
        <template #right>
          <div class="text info" :title="name" style="font-weight: 600;">
            欢迎回来，{{ name }} ～
          </div>
          <perfect-scrollbar class="text hitokoto">
            <div
              :title="
                hitokoto.id ? hitokoto.hitokoto + ' ———— ' + hitokoto.from : ''
              "
            >
              {{
                hitokoto.id
                  ? hitokoto.hitokoto + ' ———— ' + hitokoto.from
                  : '请稍后 ...'
              }}
            </div>
          </perfect-scrollbar>
        </template>
      </Card>

      <Card>
        <template #left>
          <div class="bg svg clock full"></div>
        </template>
        <template #right>
          <div class="text info" :title="name" style="font-weight: 600;">
            {{ '距离上次登陆' }}
          </div>
          <div class="box">
            <span class="count">{{ lastLoginTime }}</span>
            <span class="text">天</span>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { mapGetters } from 'vuex'
import Card from '@/components/SvgCard/index.vue'
import dayjs from 'dayjs'
@Component({
  components: {
    Card,
  },
  computed: {
    ...mapGetters(['viewport', 'device']),
    ...mapGetters(['username', 'name', 'avatar', 'profile']),
  },
})
export default class GridCard extends Vue {
  get lastLoginTime() {
    return dayjs(new Date()).diff(
      dayjs((this as any).profile.raw.lastLoginTime),
      'day',
    )
  }

  hitokoto = {}

  created() {
    // get hitokoto
    import('axios').then((axios) => {
      ;(axios as any).get('https://v1.hitokoto.cn/').then((res) => {
        this.hitokoto = res.data
      })
    })
  }
}
</script>

<style lang="scss" scoped>
$row-height: 160px;
.grid {
  display: grid;
  position: relative;
  width: 100%;
  grid-template-columns: repeat(2, auto);
  grid-template-rows: $row-height;
  grid-gap: 12px 12px;
  &.m {
    grid-template-columns: repeat(1, auto);
    grid-template-rows: repeat(3, $row-height - 30px);
  }
}

.bg.svg {
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;

  &.welcome {
    background-image: url('~@/assets/svg/1.svg');
  }
  &.clock {
    background-image: url('~@/assets/svg/2.svg');
  }
  &.awareness-day {
    background-image: url('~@/assets/svg/3.svg');
  }
}
.hitokoto {
  max-height: calc(100% - 1.7rem);
  font-size: 0.8rem;
}

.text {
  line-height: 1.5;
}
.info {
  margin-bottom: 0.618rem;
  font-size: 0.91rem;
  text-overflow: ellipsis;
  max-width: 100%;
  overflow: hidden;
}
.box {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  height: calc(100% - 1.8rem);
  .count {
    font-size: 3rem;
    display: inline;
    padding: 0 0.5em;
    font-weight: 500;
    line-height: 1;
  }
  .text {
    white-space: nowrap;
  }
}
.full {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
}
.column {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
</style>
