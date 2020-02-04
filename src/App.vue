<template>
  <v-app>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import {ServiceModel} from '@/models/ServiceModel'
  import {CharField, UUIDField} from '@/models/Field'

  class Item extends ServiceModel {
    static keyName = 'AppItem'
    static parents = ['instance']

    static fieldsDef = {
      id: new UUIDField(),
      name: new CharField({label: 'Name'})
    }
  }

  @Component
  export default class App extends Vue {
    item: Item | null = null

    created () {
      Item.objects.get('1', {instance: 'text'}).then(obj => {
        this.item = obj
      })
    }
  }
</script>
