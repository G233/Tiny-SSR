import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
// 修改成一个工厂函数，返回一个 Router 对象
export function createRouter() {
  return new Router({
    mode: 'history',
    routes: [
      {
        path: '/',
        component: () => import('../views/home.vue'),
      },
      {
        path: '/page',
        component: () => import('../views/page.vue'),
      },
    ],
  })
}
