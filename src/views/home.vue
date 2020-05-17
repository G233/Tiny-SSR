<template>
  <div>
    <div style="margin-bottom:100px">这是异步数据，在服务器端插入</div>
    <div style="margin-bottom:10px" v-for="(item, index) in recent">
      <router-link to="/page"> {{ item }}</router-link>
    </div>
  </div>
</template>
<script>
export default {
  asyncData({ store, route }) {
    // 触发 action 后，会返回 Promise
    return store.dispatch('getAllData')
  },
  computed: {
    recent() {
      return this.$store.state.recent
    },
  },
}
</script>
