import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store'
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:8080/Team_weacsoft_AutomaticCourse_war_exploded'
axios.defaults.withCredentials = true
Vue.prototype.$axios = axios
Vue.config.productionTip = false
Vue.use(ElementUI)
new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
