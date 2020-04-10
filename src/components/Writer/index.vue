<template>
  <el-form ref="form" :model="model" label-width="80px">
    <material-input
      :value="model.title"
      :name="name"
      @change="handleChangeTitle"
    />
  </el-form>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import NormInput from '@/components/Input/NormalInput.vue'
import MaterialInput from '../Input/MaterialInput.vue'
import { Prop } from 'vue-property-decorator'

@Component({
  components: {
    NormInput,
    MaterialInput,
  },
  created() {
    const model = {
      title: this.$props.title,
      text: this.$props.text,
    }
    this.$data.model = model
  },
})
export default class Writer extends Vue {
  @Prop({ required: true })
  name!: string

  @Prop({ required: true })
  title!: string

  @Prop({ required: true })
  text!: string

  model = {
    title: '',
    text: '',
  }
  handleEmitChange() {
    this.$emit('change', this.model)
  }
  handleChangeTitle(e: string) {
    this.model.title = e
    this.handleEmitChange()
  }
  handleChangeText(e: string) {
    this.model.text = e
    this.handleEmitChange()
  }
}
</script>
