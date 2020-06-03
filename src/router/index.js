import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/main',
    name: 'Main',
    component: () => import('../views/Main.vue'),
    redirect: '/ware',
    children: [
      {
        path: '/user',
        name: 'User',
        component: () => import('../views/User.vue')
      },
      {
        path: '/ware',
        name: 'Ware',
        component: () => import('../views/Ware.vue')
      },
      {
        path: '/piece',
        name: 'Piece',
        component: () => import('../views/Piece.vue')
      },
      {
        path: '/supplier',
        name: 'Supplier',
        component: () => import('../views/Supplier.vue')
      },
      {
        path: '/dealer',
        name: 'Dealer',
        component: () => import('../views/Dealer.vue')
      },
      {
        path: '/person',
        name: 'Person',
        component: () => import('../views/Person.vue')
      },
      {
        path: '/count',
        name: 'Count',
        component: () => import('../views/Count.vue')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})
export const createRouter = new VueRouter({
  mode: 'history',
  routes
})
export default router
