import { Component, Vue } from 'vue-property-decorator'
import { MessageBox } from 'element-ui'
import { PostRespDto } from '@/models/response.dto'

export interface SavedDataType {
  time: string
  data: {
    title: string
    text: string
  }
}
@Component({
  beforeDestroy() {
    console.log('clear auto save timer', (this as any).autoSaveTimer)
    // @ts-ignore
    this.autoSaveTimer = clearInterval((this as any).autoSaveTimer)
  },
  methods: {
    _confirm(key, data) {
      MessageBox.confirm('检测到保存的草稿，是否读取？', '提示', {
        type: 'info',
        cancelButtonText: '删除草稿',
      })
        .then(() => {
          // @ts-ignore
          this.model = (JSON.parse(data) as SavedDataType).data
        })
        .catch(() => {
          localStorage.removeItem(key)
        })
    },
  },
  async mounted() {
    if (!(this as any).id) {
      const key = (this as any).prefix
      const savedData = localStorage.getItem(key)
      if (savedData) {
        ;(this as any)._confirm(key, savedData)
      }
      return
    } else {
      // @ts-ignore
      const key = this.prefix + '-' + this.id
      const savedData = localStorage.getItem(key)
      if (savedData) {
        ;(this as any)._confirm(key, savedData)
      }
    }
  },
})
export class AutoSave extends Vue {
  autoSaveTimer: any
  prefix!: string
  id: any
  model: any
  handleSave() {
    this.$message.success('自动保存已开启')
    this.autoSaveTimer = setInterval(() => {
      console.log('save', this.model)
      const data = JSON.stringify({
        time: new Date().toISOString(),
        data: this.model,
      })
      if (this.id) {
        localStorage.setItem(this.prefix + '-' + this.id, data)
      } else localStorage.setItem(this.prefix, data)
    }, 3000)
  }
}
