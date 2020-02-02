<template>
  <jst-container padding>
    <hello-world msg="1"/>
  </jst-container>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import {JstContainer} from '@/components/base/grid'

  @Component({
    components: {
      JstContainer,
      'hello-world': () => import('@/components/HelloWorld.vue')
    }
  })
  export default class Home extends Vue {
  }
</script>
