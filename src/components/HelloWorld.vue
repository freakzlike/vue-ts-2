<template>
  <jst-container>
    <jst-layout>
      <jst-flex cols="7">
        Flex 1
      </jst-flex>
      <jst-flex cols="5">
        Flex 2
      </jst-flex>
    </jst-layout>
    {{ msg }}
  </jst-container>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator'
  import {JstContainer, JstLayout, JstFlex} from '@/components/base/grid'

  @Component({
    components: {
      JstContainer,
      JstLayout,
      JstFlex
    }
  })
  export default class HelloWorld extends Vue {
    @Prop(String) private msg!: string;
  }
</script>
