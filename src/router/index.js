
import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () => import('components/Login')
const Home = () => import('components/Home')
const Welcome = () => import('components/Welcome')
const Users = () => import('components/user/Users')
const Rights = () => import('components/power/Rights')
const Roles = () => import('components/power/Roles')
const Cate = () => import('components/goods/Cate')
const Params = () => import('components/goods/Params')
const List = () => import('components/goods/List')
const Add = () => import('components/goods/Add.vue')
const Order = () => import('components/order/Order')
const Report = () => import('components/report/Report')
Vue.use(VueRouter)

const routes = [
  {
    path: '',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/categories',
        component: Cate
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/goods',
        component: List
      },
      {
        path: '/add',
        component: Add
      },
      {
        path: '/orders',
        component: Order
      },
      {
        path: '/reports',
        component: Report
      }
    ]
  },


]

const router = new VueRouter({
  mode: 'history',
  routes
})
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 当前跳转的路径
  // next 放行 
  if (to.path === '/login') return next();
  const tokenStr = window.sessionStorage.getItem('token');
  if (!tokenStr) return next('/login');
  next()
}
)
export default router
