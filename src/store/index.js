import Vue from 'vue'
import Vuex from 'vuex'
import { getAll } from '../api/home'
import { getPage } from '../api/page'
Vue.use(Vuex)
// 返回一个 Store 对象
export function createStore() {
  return new Vuex.Store({
    state: {
      recent: [],
      page: '',
    },
    mutations: {
      SET_DATA: (state, num) => {
        state.recent = num
      },
      SET_PAGE: (state, num) => {
        state.page = num
      },
    },
    actions: {
      getAllData({ commit }) {
        return getAll().then((res) => {
          commit('SET_DATA', res)
        })
      },
      getPageData({ commit }) {
        return getPage().then((res) => {
          commit('SET_PAGE', res)
        })
      },
    },
    modules: {},
  })
}
