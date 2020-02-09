<template>
  <v-app>
    <v-navigation-drawer permanent app expand-on-hover>
      <v-list>
        <v-list-item link exact :to="{name: 'home'}">
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item>
      </v-list>

      <v-divider/>

      <v-list nav dense>
        <v-list-item link :to="{name: 'app:PostListView'}">
          <v-list-item-icon>
            <v-icon>mdi-post</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Posts</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'

  @Component
  export default class App extends Vue {
  }
</script>
