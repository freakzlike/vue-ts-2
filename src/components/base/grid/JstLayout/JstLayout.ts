import Vue, {VNode} from 'vue'
import {VRow} from 'vuetify/lib'

interface ComputedProps {
  dense?: Boolean;
  'no-gutters'?: Boolean;
}

export default Vue.extend({
  name: 'JstLayout',
  inheritAttrs: false,
  props: {
    gutter: {
      type: Boolean,
      default: false
    },
    column: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    props (): ComputedProps {
      const props: ComputedProps = {}

      if (this.gutter) {
        props.dense = true
      } else {
        props['no-gutters'] = true
      }

      return props
    },
    cssClasses (): Array<string> {
      const classes = []

      if (this.column) {
        classes.push('fill-height', 'flex-column', 'flex-nowrap')
      }

      return classes
    }
  },
  render (h): VNode {
    return h(VRow, {
      props: this.props,
      class: this.cssClasses,
      attrs: this.$attrs,
      on: this.$listeners
    }, this.$slots.default)
  }
})
