import QProgress from 'qier-progress'
import Vue from 'vue'

export const progress = new QProgress()

Vue.prototype.$process = progress
