import { Vue, Component } from 'vue-property-decorator'

@Component
export class ConfirmLeave extends Vue {
  model = {
    title: '',
    text: '',
  }

  created() {
    window.onbeforeunload = (event: BeforeUnloadEvent) => {
      if (this.model.title !== '' && this.model.text !== '') {
        return '你确定要离开?未保存的数据将丢失'
      }
    }
  }
}
