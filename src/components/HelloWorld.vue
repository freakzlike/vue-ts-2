<template>
  <v-container>
    {{ msg }}
  </v-container>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator'

  @Component
  export default class HelloWorld extends Vue {
    @Prop(String) private msg!: string;
  }
</script>
