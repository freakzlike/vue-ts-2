<template>
  <v-container>
    <hello-world msg="1"/>
  </v-container>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'

  @Component({
    components: {
      'hello-world': () => import('@/components/HelloWorld.vue')
    }
  })
  export default class Home extends Vue {
  }
</script>
