<template>
  <jst-container padding>
    <jst-layout>
      <jst-flex :cols="12">
        <h3>PostListView</h3>
      </jst-flex>
    </jst-layout>

    <jst-layout>
      <v-btn @click="loadPosts">
        Load Posts
      </v-btn>
    </jst-layout>

    <jst-layout v-if="dataStatus">
      <template v-for="(post, index) in posts">
        <jst-flex :key="index" :cols="12">
          <router-link :to="{name: 'app:PostDetailView', params: {id: post.val.id}}">
            {{ post.val.id }} - {{ post.val.title }}
          </router-link>
        </jst-flex>
      </template>
    </jst-layout>
  </jst-container>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import {JstContainer, JstLayout, JstFlex} from '@/components/base/grid'

  import Post from '@/app/models/Post'

  @Component({
    components: {
      JstContainer,
      JstLayout,
      JstFlex
    }
  })
  export default class PostListView extends Vue {
    dataStatus: boolean = false
    posts: Array<Post> | null = null

    mounted () {
      this.loadPosts()
    }

    loadPosts () {
      this.dataStatus = false
      this.posts = null
      Post.objects.all().then(data => {
        this.dataStatus = true
        this.posts = data
      })
    }
  }
</script>
