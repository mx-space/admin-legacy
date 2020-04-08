<template>
  <PageLayout>
    <div class="grid">
      <GridCard />
    </div>
  </PageLayout>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import PageLayout from '@/layouts/PageLayout.vue'
import GridCard from './components/GridCard.vue'
import Component from 'vue-class-component'
@Component({
  components: {
    PageLayout,
    GridCard,
  },
  computed: {
    ...mapGetters(['viewport']),
  },
})
export default class Dashboard extends Vue {}
</script>
