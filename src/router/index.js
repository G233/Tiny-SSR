import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/home.vue'
import Page from '../views/page.vue'

Vue.use(Router)
// 修改成一个工厂函数，返回一个 Router 对象
export function createRouter() {
  return new Router({
    mode: 'history',
    routes: [
      {
        path: '/',
        component: Home,
      },
      {
        path: '/page',
        component: Page,
      },
    ],
  })
}
