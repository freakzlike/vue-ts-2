import Vue, {VNode} from 'vue'
import {VContainer} from 'vuetify/lib'

export default Vue.extend({
  name: 'JstContainer',
  inheritAttrs: false,
  props: {
    padding: {
      type: [Boolean, Number, String],
      default: false
    }
  },
  computed: {
    cssClasses (): Array<string> {
      const classes = []

      if (typeof this.padding === 'boolean') {
        classes.push(this.padding ? 'pa-2' : 'pa-0')
      } else {
        classes.push('pa-' + this.padding.toString())
      }

      return classes
    }
  },
  render (h): VNode {
    return h(VContainer, {
      props: {
        fluid: true
      },
      class: this.cssClasses,
      attrs: this.$attrs,
      on: this.$listeners
    }, this.$slots.default)
  }
})
