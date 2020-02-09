<template>
  <jst-container padding>
    <jst-layout>
      <jst-flex :cols="12">
        <h3>PostDetailView</h3>
      </jst-flex>
    </jst-layout>

    <jst-layout>
      <v-btn @click="loadPost">
        Load Post
      </v-btn>
    </jst-layout>

    <jst-layout v-if="dataStatus">
      <jst-flex :cols="12">
        {{ post.val.id }}
      </jst-flex>

      <jst-flex :cols="12">
        {{ post.val.title }}
      </jst-flex>

      <jst-flex :cols="12">
        {{ post.val.body }}
      </jst-flex>
    </jst-layout>
  </jst-container>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator'
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
    @Prop({required: true}) private id!: string

    dataStatus: boolean = false
    post: Post | null = null

    mounted () {
      this.loadPost()
    }

    loadPost () {
      this.dataStatus = false
      this.post = null
      Post.objects.get(this.id).then(data => {
        this.dataStatus = true
        this.post = data
      })
    }
  }
</script>
