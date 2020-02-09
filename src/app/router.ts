export default [
  {
    path: '/app/posts',
    name: 'app:PostListView',
    component: () => import('@/app/views/PostListView.vue')
  },
  {
    path: '/app/posts/:id',
    name: 'app:PostDetailView',
    component: () => import('@/app/views/PostDetailView.vue'),
    props: true
  }
]
