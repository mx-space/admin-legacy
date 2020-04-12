<script lang="ts">
import Vue from 'vue'
// import { Component, Prop, Watch } from 'vue-property-decorator'
// import { throttle } from 'lodash'
// @Component
// export default class InputMixin extends Vue {
//   @Prop({ default: 'text' })
//   type!: string
//   @Prop()
//   value!: string
//   text = this.value || ''
//   handleChange = throttle(() => {
//     console.log('sync')
//     this._handleChange()
//   }, 50)

//   _handleChange() {
//     this.$emit('change', this.text)
//   }

//   @Watch('value')
//   sync(val: string) {
//     if (this.text !== val) {
//       this.text = val
//     }
//   }
// }

export default Vue.extend({
  data() {
    return {
      text: this.value || '',
    }
  },
  props: ['value', 'type'],
  methods: {
    handleChange() {
      this.$emit('change', this.text)
    },
  },
  watch: {
    value(val: string) {
      if (this.text !== val) {
        this.text = val
      }
    },
  },
})
</script>
