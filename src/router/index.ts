import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'
import store from '@/store'

Vue.use(VueRouter)

// 路由配置规则
const routes: Array<RouteConfig> = [
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: 'login' */ '@/views/login/index.vue')
  },
  {
    path: '/',
    component: Layout,
    meta: { // 父路由中配置了此项，子路由可不用配置
      requiresAuth: true // 路由元信息，自定义数据，标识需要登录才能访问此页面
    }, // meta默认是一个空字段
    children: [
      {
        path: '', // 默认子路由
        name: 'home',
        component: () => import(/* webpackChunkName: 'home' */ '@/views/home/index.vue')
        // meta: {
        //   requiresAuth: true // 路由元信息，自定义数据，标识需要登录才能访问此页面
        // } // meta默认是一个空字段
      },
      {
        path: '/role',
        name: 'role',
        component: () => import(/* webpackChunkName: 'role' */ '@/views/role/index.vue')
      },
      {
        path: '/menu',
        name: 'menu',
        component: () => import(/* webpackChunkName: 'menu' */ '@/views/menu/index.vue')
      },
      {
        path: '/resource',
        name: 'resource',
        component: () => import(/* webpackChunkName: 'resource' */ '@/views/resource/index.vue')
      },
      {
        path: '/course',
        name: 'course',
        component: () => import(/* webpackChunkName: 'course' */ '@/views/course/index.vue')
      },
      {
        path: '/user',
        name: 'user',
        component: () => import(/* webpackChunkName: 'user' */ '@/views/user/index.vue')
      },
      {
        path: '/advert',
        name: 'advert',
        component: () => import(/* webpackChunkName: 'advert' */ '@/views/advert/index.vue')
      },
      {
        path: '/advert-space',
        name: 'advert-space',
        component: () => import(/* webpackChunkName: 'advert-space' */ '@/views/advert-space/index.vue')
      }
    ]
  },
  {
    path: '*',
    name: '404',
    component: () => import(/* webpackChunkName: '404' */ '@/views/error-page/404.vue')
  }
]

const router = new VueRouter({
  routes
})

// 全局前置守卫：任何页面的访问都要经过这里
// to: 要去哪里的路由信息
// from: 从哪里来的路由信息
// next: 通行的标志，允许通过就调用next方法
router.beforeEach((to, from, next) => {
  // console.log('进入了路由全局守卫') // 打印信息中的matched是访问时匹配到的路由记录，2条是本身和layout父路由
  // console.log('to=>', to)
  // console.log('from=>', from)

  // to.matched 是一个数组(匹配到的路由记录)
  if (to.matched.some(record => record.meta.requiresAuth)) { // 如果有一个路由记录(父与子路由)中的meta.requiresAuth为true则需要登录才能访问
    // 校验登录状态
    if (!store.state.user) { // 如果没有登录状态，则跳转到登录页
      next({
        name: 'login',
        query: { // 通过url传递宣传字符串参数
          redirect: to.fullPath // 把登录成功需要返回的页面告诉登录页
        }
      })
    } else { // 如果已登录，则通过
      next()
    }
  } else { // 如果不需要登录，则通过
    next()
  }

  // 路由守卫中一定要调用next，否则页面无法展示
  // next()
  // 如果所有的页面都需要登录才能访问，则也可以采用这种方式
  // if (to.path !== '/login') {
  //   // 校验登录状态
  // }
})

export default router
