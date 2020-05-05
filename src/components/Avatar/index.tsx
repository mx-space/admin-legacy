import Component from 'vue-class-component'
import { Prop, Vue } from 'vue-property-decorator'
import style from './index.module.scss'

@Component
export default class Avatar extends Vue {
  @Prop({ default: 50 })
  size!: number
  load = false
  handleLoadError() {
    ;(this.$refs.img as HTMLElement).remove()
  }
  handleLoad() {
    this.load = true
  }
  @Prop({ required: true })
  src!: string
  render() {
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
