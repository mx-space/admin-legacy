import Component from 'vue-class-component'
import { Prop, Vue } from 'vue-property-decorator'

import { CreateElement } from 'vue/types/umd'
import style from './index.module.scss'

@Component
export default class Avatar extends Vue {
  @Prop({ default: 50 })
  size!: number
  load = false
  handleLoadError(e: Event) {
    ;(this.$refs.img as HTMLElement).remove()
  }
  handleLoad() {
    this.load = true
  }
  @Prop({ required: true })
  src!: string
  render(h: CreateElement) {
    return (
      <div
        class={style.avatar}
        style={{ height: `${this.size}px`, width: `${this.size}px` }}
      >
        <img
          src={this.src}
          onLoad={this.handleLoad}
          onError={this.handleLoadError}
          ref="img"
          style={{ display: this.load ? '' : 'none' }}
        />
      </div>
    )
  }
}
