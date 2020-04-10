<script lang="ts">
import Vue from 'vue'
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
})
</script>
