import { Vue, Component } from 'vue-property-decorator'
@Component({})
export class FullScreenProperty extends Vue {
  fullscreen = false
  toggleFullscreen() {
    this.fullscreen = !this.fullscreen
  }

  mounted() {
    document.onkeydown = (e) => {
      if (e.keyCode === 27) {
        e.stopPropagation()
        e.preventDefault()

        this.fullscreen = false
      }
    }
  }

  beforeDestroy() {
    document.onkeydown = null
  }
}
