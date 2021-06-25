import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'assets/css/global.css'
import './plugins/element.js'
import axios from 'axios'
// 请求路径
Vue.prototype.$http = axios
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
