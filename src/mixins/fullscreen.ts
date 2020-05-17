import { Vue, Component } from 'vue-property-decorator'
@Component
export class FullScreenProperty extends Vue {
  fullscreen = false
  toggleFullscreen() {
    this.fullscreen = !this.fullscreen
  }
}
