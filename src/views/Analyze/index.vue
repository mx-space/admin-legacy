<template>
  <page-layout>
    <div
      :style="{
        columns: viewport.mobile ? 1 : 2,
      }"
    >
      <small>今日请求走势</small>
      <div ref="day-chart"></div>
      <small>本周请求走势</small>
      <div ref="week-chart"></div>
      <small>本月请求走势</small>
      <div ref="month-chart"></div>
      <small>请求量</small>
      <div ref="pie-chart"></div>
    </div>

    <small>最近请求</small>
    <el-table :data="tableData" style="width: 100%;">
      <el-table-column prop="date" label="时间" width="120px">
      </el-table-column>
      <el-table-column prop="browser" label="浏览器" width="120px">
      </el-table-column>
      <el-table-column prop="os" label="OS" width="120px"> </el-table-column>
      <el-table-column
        header-align="left"
        align="left"
        prop="ua"
        label="UA"
        :width="viewport.mobile ? '500px' : ''"
      >
      </el-table-column>
    </el-table>

    <el-pagination
      layout="prev, pager, next"
      :total="pager.total"
      :page-size="50"
      :current-page="pager.currentPage"
      @prev-click="handleTo(pager.currentPage - 1)"
      @next-click="handleTo(pager.currentPage + 1)"
      @current-change="handleTo"
      v-if="pager.totalPage > 1"
      :style="{
        textAlign: 'center',
        marginTop: '24px',
      }"
    >
    </el-pagination>
  </page-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import PageLayout from '@/layouts/PageLayout.vue'
import { Chart } from '@antv/g2'
import { UA, PagerDto } from '../../models/response.dto'
import dayjs from 'dayjs'
import { Getter } from 'vuex-class'
import { ViewportRecord } from '../../store/interfaces/viewport.interface'

@Component({
  components: {
    PageLayout,
  },
})
export default class AnalyzeView extends Vue {
  @Getter
  viewport!: ViewportRecord

  raw = [] as UA.Root[]
  total = {
    callTime: 0,
    uv: 0,
  }
  todayIps: string[] = []
  pager: PagerDto = {} as any
  tableData: any[] = []
  chartDataDay = [{}]
  chartDataMonth = [{}]
  chartDataWeek = [{}]
  fragment:
    | {}
    | Record<'today' | 'weeks' | 'months', Record<string, number>> = {}

  chartDay: null | Chart = null
  chartMonth: null | Chart = null
  chartWeek: null | Chart = null
  chartPie: null | Chart = null
  async created() {
    await this.fetch()
  }

  async fetch(page = 1, size = 50) {
    const resp = (await this.$api('Analyze').gets({
      page,
      size,
    })) as {
      data: UA.Root[]
      total: {
        [key: string]: number
      }
      today_ips: string[]
      page: PagerDto
    }
    const { data, total, today_ips } = resp
    this.raw = [...data]
    this.total = { ...total } as any
    this.todayIps = today_ips
    this.tableData = this.parseUATableData(data)
    this.pager = { ...resp.page }

    const fragment = (await this.$api('Analyze').get('fragment')) as Fragment
    this.fragment = fragment
    this.parseChartData(fragment)
    this.renderChart()
    this.renderPie()
  }

  parseUATableData(raw: UA.Root[]) {
    return raw.map((i) => {
      return {
        date: dayjs(i.timestamp).format('MM-DD H:mm:ss'),
        browser:
          (i.ua.browser && i.ua.browser.name + ' ' + i.ua.browser.major) || '',
        os: i.ua.os ? i.ua.os.name + ' ' + i.ua.os.version : '',
        ua: i.ua.ua,
      }
    })
  }
  parseChartData(fragment: Fragment) {
    const { today, weeks, months } = fragment
    this.chartDataDay = this._parseChartValue(today, ['时刻', '访问次数'])
    this.chartDataWeek = this._parseChartValue(weeks, ['本周天', '访问次数'])
    this.chartDataMonth = this._parseChartValue(months, ['本月天', '访问次数'])
  }

  _parseChartValue(data: Record<string, number>, label: [string, string]) {
    return Object.entries(data).map(([k, v]) => {
      return {
        [label[0]]: ~~k,
        [label[1]]: v,
      }
    })
  }

  renderChart() {
    this._renderChart(
      this.$refs['day-chart'] as HTMLElement,
      'chartDay',
      this.chartDataDay,
      ['时刻', '访问次数'],
    )
    this._renderChart(
      this.$refs['week-chart'] as HTMLElement,
      'chartWeek',
      this.chartDataWeek,
      ['本周天', '访问次数'],
    )
    this._renderChart(
      this.$refs['month-chart'] as HTMLElement,
      'chartMonth',
      this.chartDataMonth,
      ['本月天', '访问次数'],
    )
  }
  _renderChart(
    element: HTMLElement,
    field: 'chartDay' | 'chartWeek' | 'chartMonth',
    data: any,
    label: [string, string],
  ) {
    this[field] = new Chart({
      container: element,
      autoFit: true,
      height: 250,
    })

    this[field]!.data(data)
    this[field]!.tooltip({
      showCrosshairs: true,
      shared: true,
    })
    this[field]!.scale({
      [label[0]]: {
        range: [0, 1],
      },
      [label[1]]: {
        min: 0,
        nice: true,
      },
    })
    this[field]!.line()
      .position(label[0] + '*' + label[1])
      .label(label[1])
      .shape('smooth')
    this[field]!.point().position(label[0] + '*' + label[1])
    this[field]!.render()
  }
  renderPie() {
    const total = this.total
    const data = [
      {
        item: 'Other',
        count: total.callTime - total.uv,
        percent: 1 - total.uv / total.callTime,
      },
      {
        item: 'UV',
        count: total.uv,
        percent: total.uv / total.callTime,
      },
    ]
    const chart = new Chart({
      container: this.$refs['pie-chart'] as HTMLElement,
      autoFit: true,
      height: 250,
    })

    chart.coordinate('theta', {
      radius: 0.75,
    })

    chart.data(data)

    chart.tooltip({
      showTitle: false,
      showMarkers: false,
    })

    chart
      .interval()
      .position('percent')
      .color('item')
      .label('percent', {
        content: (data) => {
          return `${data.item}: ${(data.percent * 100).toFixed(2)}%`
        },
      })
      .adjust('stack')

    chart.render()
  }
  async handleTo(page: number) {
    await this.fetch(page)
  }
}

interface Fragment {
  today: Record<string, number>
  weeks: Record<string, number>
  months: Record<string, number>
}
</script>

<style lang="scss" scoped>
small {
  margin: 12px 6px;
  color: #888;
  display: inline-block;
  font-weight: 600;
}
</style>
