<template>
  <div>
    <div>这也是异步数据，在服务器端插入</div>
    <div class="page" v-html="page"></div>
  </div>
</template>
<script>
export default {
  asyncData({ store, route }) {
    // 触发 action 后，会返回 Promise
    return store.dispatch('getPageData')
  },
  computed: {
    page() {
      return this.$store.state.page
    },
  },
}
</script>
<style>
.page {
  width: 50%;
  margin: auto;
  min-width: 500px;
}
</style>
