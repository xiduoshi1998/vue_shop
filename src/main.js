import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'assets/css/global.css'
import Element from 'element-ui';
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor';
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(Element);
// 富文本
Vue.use(VueQuillEditor)

// 格式化时间
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal * 1000)
  const y = dt.getFullYear();
  const m = (dt.getMonth() + 1 + '').padStart(2, '0');
  const d = (dt.getDate() + 1 + '').padStart(2, '0');

  const hh = (dt.getHours() + 1 + '').padStart(2, '0');
  const mm = (dt.getMinutes() + 1 + '').padStart(2, '0');
  const ss = (dt.getDate() + 1 + '').padStart(2, '0');
  return `${y}-${m}-${d}-${hh}:${mm}:${ss}`
})


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
