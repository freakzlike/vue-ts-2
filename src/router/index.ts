import Vue from 'vue'
import VueRouter from 'vue-router'
import appRouter from '@/app/router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue')
  },
  ...appRouter
]

const router = new VueRouter({
  routes
})

export default router
