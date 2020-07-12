<template>
  <page-layout>
    <template #header>
      <LayoutButton
        name="刷新"
        :icon="['fas', 'sync-alt']"
        backcolor="#27ae60"
        @click.native="refresh"
      />
      <LayoutButton
        name="清空表"
        :icon="['far', 'trash-alt']"
        backcolor="#e74c3c"
        @click.native="dialogVisible = true"
      />
    </template>
    <section
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
    </section>
    <section>
      <small> 今天 - 所有请求的 IP {{ todayIps.length }} 个 </small>
      <div class="tags">
        <el-tag v-for="ip in todayIps" :key="ip" effect="plain">
          <el-popover placement="top" trigger="click" @show="getIpLocation(ip)">
            <p v-html="ipLocation"></p>
            <span slot="reference" style="cursor: pointer;">{{ ip }}</span>
          </el-popover>
        </el-tag>
      </div>
    </section>

    <section>
      <small>最近请求</small>
      <el-table :data="tableData" style="width: 100%;">
        <el-table-column prop="date" label="时间" width="120px">
        </el-table-column>
        <el-table-column prop="ip" label="IP" width="130px">
          <template slot-scope="scope">
            <el-popover
              placement="top"
              trigger="click"
              @show="getIpLocation(scope.row.ip)"
            >
              <p v-html="ipLocation"></p>
              <el-button slot="reference" type="text">{{
                scope.row.ip
              }}</el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          header-align="left"
          align="left"
          prop="path"
          label="请求路径"
          show-overflow-tooltip
          width="200px"
        >
        </el-table-column>
        <el-table-column prop="browser" label="浏览器" width="120px">
        </el-table-column>
        <el-table-column prop="os" label="OS" width="120px"> </el-table-column>
        <el-table-column
          prop="ua"
          label="UA"
          :width="!viewport.desktop ? '500px' : ''"
        >
        </el-table-column>
      </el-table>
    </section>

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

    <el-dialog title="提示" :visible.sync="dialogVisible" width="300px">
      <span>确定要清空表么?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="
            handleClearData()
            dialogVisible = false
          "
          >确 定</el-button
        >
      </span>
    </el-dialog>
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
import LayoutButton from '@/components/Button/LayoutButton.vue'
@Component({
  components: {
    PageLayout,
    LayoutButton,
  },
})
export default class AnalyzeView extends Vue {
  dialogVisible = false
  @Getter
  viewport!: ViewportRecord
  ipLocation = ''
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
    await this.fetch().then(() => {
      this.renderChart()
      this.renderPie()
    })
  }
  async refresh() {
    await this.fetch(1)
    this.chartDay?.changeData(this.chartDataDay)
    this.chartMonth?.changeData(this.chartDataMonth)
    this.chartWeek?.changeData(this.chartDataWeek)
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
  }

  parseUATableData(raw: UA.Root[]) {
    return raw.map((i) => {
      return {
        date: dayjs(i.created).format('MM-DD H:mm:ss'),
        browser:
          (i.ua.browser && i.ua.browser.name + ' ' + i.ua.browser.major) || '',
        os: i.ua.os ? i.ua.os.name + ' ' + i.ua.os.version : '',
        ua: i.ua.ua,
        ip: i.ip,
        path: i.path,
      }
    })
  }
  parseChartData(fragment: Fragment) {
    const { today, weeks, months } = fragment
    this.chartDataDay = today
    this.chartDataWeek = weeks
    this.chartDataMonth = months
  }

  renderChart() {
    this._renderChart(
      this.$refs['day-chart'] as HTMLElement,
      'chartDay',
      this.chartDataDay,
      // ['时刻', '访问次数'],
      ['hour', 'key', 'value'],
    )
    this._renderChart(
      this.$refs['week-chart'] as HTMLElement,
      'chartWeek',
      this.chartDataWeek,
      // ['本周天', '访问次数'],
      ['day', 'key', 'value'],
    )
    this._renderChart(
      this.$refs['month-chart'] as HTMLElement,
      'chartMonth',
      this.chartDataMonth,
      // ['本月天', '访问次数'],
      ['date', 'key', 'value'],
    )
  }
  _renderChart(
    element: HTMLElement,
    field: 'chartDay' | 'chartWeek' | 'chartMonth',
    data: any,
    label: [string, string, string],
  ) {
    this[field] = new Chart({
      container: element,
      autoFit: true,
      height: 250,
      padding: [30, 20, 70, 30],
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
      [label[2]]: {
        min: 0,
        nice: true,
      },
    })
    this[field]!.line()
      .position(label[0] + '*' + label[2])
      .label(label[2])
      .color(label[1])
      .shape('smooth')
    this[field]!.point()
      .position(label[0] + '*' + label[2])
      .label(label[2])
      .color(label[1])
      .shape('circle')

    // this[field]!.point().position(label[0] + '*' + label[1])
    // this[field]!.point().position(label[0] + '*' + label[2])
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
      .position('count')
      .color('item')
      .label('percent', {
        content: (data) => {
          return `${data.item}: ${(data.percent * 100).toFixed(2)}%`
        },
      })
      .adjust('stack')

    chart.render()
  }

  async getIpLocation(ip: string) {
    this.ipLocation = '获取中...'
    //https://github.com/metowolf/ipdb-API
    const apiUrl =
      process.env.VUE_APP_IP_QUERY_URL || 'https://api.i-meto.com/ip/v1/qqwry/'

    const response = await fetch(apiUrl + ip)
    const data = await response.json()

    this.ipLocation = `IP: ${data.ip}<br />
    城市: ${data.country_name || ''} ${data.region_name || ''} ${
      data.city_name || ''
    }<br />
    ISP: ${data.isp_domain}<br />
    组织: ${data.owner_domain}<br />
    范围: ${JSON.stringify(data.range)}
    `
  }
  async handleClearData() {
    await this.$api('Analyze').del()
    this.$message.success('清空完成')
    await this.fetch()
  }
  async handleTo(page: number) {
    await this.fetch(page)
  }
}

interface AccessRecord {
  ip: number
  pv: number
}

interface Fragment {
  today: ({ hour: number } & AccessRecord)[]
  weeks: ({ day: number } & AccessRecord)[]
  months: ({ date: number } & AccessRecord)[]
}
</script>

<style lang="scss" scoped>
small {
  margin: 12px 6px;
  color: #888;
  display: inline-block;
  font-weight: 600;
}
.tags > * {
  margin-right: 12px;
  margin-top: 6px;
}
</style>
