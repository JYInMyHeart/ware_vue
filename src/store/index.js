import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    username: window.sessionStorage.getItem('username'),
    userRole: window.sessionStorage.getItem('userRole'),
    Authorization: window.sessionStorage.getItem('Authorization')
  },
  mutations: {
    login (state, data) {
      window.sessionStorage.setItem('username', data.username)
      window.sessionStorage.setItem('userRole', data.userRole)
      window.sessionStorage.setItem('Authorization', data.token)
      state.username = data.username
      state.userRole = data.userRole
      state.Authorization = data.token
    },
    logout (state) {
      // 注意不能用 null 清除，否则将无法判断 user 里具体的内容
      state.username = ''
      window.sessionStorage.removeItem('username')
      window.sessionStorage.removeItem('Authorization')
    }
  },
  actions: {
  },
  modules: {
  }
})
