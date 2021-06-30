import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'assets/css/global.css'
import Element from 'element-ui';
import TreeTable from 'vue-table-with-tree-grid'
Vue.use(Element);


import axios from 'axios'
// 请求路径
Vue.prototype.$http = axios
Vue.prototype.$confirm = Element.MessageBox.confirm
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/';
// 请求拦截
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
