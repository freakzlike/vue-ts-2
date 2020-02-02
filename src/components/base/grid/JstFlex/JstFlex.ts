import Vue, {VNode} from 'vue'
import {VCol} from 'vuetify/lib'

export default Vue.extend({
  name: 'JstFlex',
  inheritAttrs: false,
  render (h): VNode {
    return h(VCol, {
      attrs: this.$attrs,
      on: this.$listeners
    }, this.$slots.default)
  }
})
