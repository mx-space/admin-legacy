<template>
  <div class="group">
    <input
      :type="type || 'text'"
      required
      v-model="text"
      @change="handleChange"
      ref="input"
    />
    <span class="bar"></span>
    <label>{{ name }}</label>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import BaseInput from '@/components/Input/BaseInputMixin.vue'
export default Vue.extend({
  mixins: [BaseInput],
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  mounted() {
    ;(this.$refs.input as HTMLInputElement).addEventListener(
      'compositionstart',
      () => {
        this.$emit('composition', true)
      },
    )
    ;(this.$refs.input as HTMLInputElement).addEventListener(
      'compositionend',
      () => {
        this.$emit('composition', false)
      },
    )
  },
})
</script>

<style scoped>
* {
  box-sizing: border-box;
}
.group {
  position: relative;
  width: 100%;
}
input {
  font-size: 18px;
  padding: 10px 10px 10px 5px;
  display: block;
  width: 100%;
  border: none;
  border-bottom: 1px solid #1681e1;
}
input:focus {
  outline: none;
}

/* LABEL ======================================= */
label {
  color: #999;
  font-size: 18px;
  font-weight: normal;
  position: absolute;
  pointer-events: none;
  left: 5px;
  top: 10px;
  transition: 0.2s ease all;
  -moz-transition: 0.2s ease all;
  -webkit-transition: 0.2s ease all;
}

/* active state */
input:focus ~ label,
input:valid ~ label {
  top: -20px;
  font-size: 14px;
  color: #2d4dcec2;
}

/* BOTTOM BARS ================================= */
.bar {
  position: relative;
  display: block;
  width: 100%;
}
.bar:before,
.bar:after {
  content: '';
  height: 1px;
  width: 0;
  bottom: 1px;
  position: absolute;
  background: #1681e1;
  transition: 0.2s ease all;
  -moz-transition: 0.2s ease all;
  -webkit-transition: 0.2s ease all;
}
.bar:before {
  left: 50%;
}
.bar:after {
  right: 50%;
}

/* active state */
input:focus ~ .bar:before,
input:focus ~ .bar:after {
  width: 50%;
}
</style>
