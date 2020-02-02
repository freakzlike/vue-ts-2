<template>
  <v-app>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import {ServiceModel, TServiceParent} from '@/models/ServiceModel'
  import {CharField, UUIDField} from '@/models/Field'

  class Item extends ServiceModel {
    static parents = ['instance']

    static fields = {
      id: new UUIDField(),
      name: new CharField()
    }

    static ModelManager = class extends ServiceModel.ModelManager {
      async get (id: string, parents?: TServiceParent): Promise<ServiceModel> {
        const Model = this.model
        Model.checkServiceParents(parents)
        console.log('get called from item', id, parents)
        return new Model()
      }
    }
  }

  @Component
  export default class App extends Vue {
    created () {
      Item.objects.get('1', {instance: 'text'}).then(obj => {
        console.log('obj', obj)
      })
    }
  }
</script>
