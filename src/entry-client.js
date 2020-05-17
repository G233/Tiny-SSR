import Vue from 'vue'
import { createApp } from './app'

import ProgressBar from './components/progressbar.vue'
const bar = (Vue.prototype.$bar = new Vue(ProgressBar).$mount())
document.body.appendChild(bar.$el)

// 全局混入 beforeRouteUpdate 钩子函数，当 URL 参数发生改变的时候响应。（组件没有发生变化）
Vue.mixin({
  beforeRouteUpdate(to, from, next) {
    const { asyncData } = this.$options
    if (asyncData) {
      asyncData({
        store: this.$store,
        route: to,
      })
        .then(next)
        .catch(next)
    } else {
      next()
    }
  },
})

const { app, router, store } = createApp()

// 当使用 template 时，context.state 将作为 window.__INITIAL_STATE__ 状态，
// 自动嵌入到最终的 HTML 中。
// 而在客户端，在挂载到应用程序之前，store 就应该获取到状态：
if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}

router.onReady(() => {
  // 设置全局路由前置导航守卫，当路由跳转的时候对比前后组件差异，对发生了变化的组件调用 asyncdata 函数
  router.beforeResolve((to, from, next) => {
    const matched = router.getMatchedComponents(to)
    const prevMatched = router.getMatchedComponents(from)

    let diffed = false
    // 找出变化了的组件
    const activated = matched.filter((c, i) => {
      return diffed || (diffed = prevMatched[i] !== c)
    })
    // 提取出 async 函数
    const asyncDataHooks = activated.map((c) => c.asyncData).filter((_) => _)

    if (!asyncDataHooks.length) {
      return next()
    }
    bar.start()
    // 一次调用完
    Promise.all(asyncDataHooks.map((hook) => hook({ store, route: to })))
      .then(() => {
        bar.finish()
        next()
      })
      .catch(next)
  })
  // 这里假定 App.vue 模板中根元素具有 `id="app"`
  app.$mount('#app')
})
