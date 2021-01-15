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
        component: () => import(/* webpackChunkName: 'home' */ '@/views/home/index.vue'),
        meta: {
          title: '首页'
        }
      },
      {
        path: '/role',
        name: 'role',
        component: () => import(/* webpackChunkName: 'role' */ '@/views/role/index.vue'),
        meta: {
          title: '角色管理'
        }
      },
      {
        path: '/menu',
        name: 'menu',
        component: () => import(/* webpackChunkName: 'menu' */ '@/views/menu/index.vue'),
        meta: {
          title: '菜单管理'
        }
      },
      {
        path: '/resource',
        name: 'resource',
        component: () => import(/* webpackChunkName: 'resource' */ '@/views/resource/index.vue'),
        meta: {
          title: '资源管理'
        }
      },
      {
        path: '/course',
        name: 'course',
        component: () => import(/* webpackChunkName: 'course' */ '@/views/course/index.vue'),
        meta: {
          title: '课程管理'
        }
      },
      {
        path: '/user',
        name: 'user',
        component: () => import(/* webpackChunkName: 'user' */ '@/views/user/index.vue'),
        meta: {
          title: '用户管理'
        }
      },
      {
        path: '/advert',
        name: 'advert',
        component: () => import(/* webpackChunkName: 'advert' */ '@/views/advert/index.vue'),
        meta: {
          title: '广告列表'
        }
      },
      {
        path: '/advert-space',
        name: 'advert-space',
        component: () => import(/* webpackChunkName: 'advert-space' */ '@/views/advert-space/index.vue'),
        meta: {
          title: '广告位列表'
        }
      },
      {
        path: '/menu/create',
        name: 'menu-create',
        component: () => import(/* webpackChunkName: 'menu-create-eidt' */ '@/views/menu/create.vue'),
        meta: {
          title: '菜单管理'
        }
      },
      {
        path: '/menu/:id/edit',
        name: 'menu-edit',
        component: () => import(/* webpackChunkName: 'menu-create-eidt' */ '@/views/menu/edit.vue'),
        meta: {
          title: '菜单管理'
        }
      },
      {
        path: '/role/:roleId/alloc-menu',
        name: 'alloc-menu',
        component: () => import(/* webpackChunkName: 'alloc-menu' */ '@/views/role/alloc-menu.vue'),
        props: true, // 将路由路径参数映射到组件的props数据中,
        meta: {
          title: '角色管理'
        }
      },
      {
        path: '/role/:roleId/alloc-resource',
        name: 'alloc-resource',
        component: () => import(/* webpackChunkName: 'alloc-menu' */ '@/views/role/alloc-resource.vue'),
        props: true, // 将路由路径参数映射到组件的props数据中
        meta: {
          title: '角色管理'
        }
      },

      /* 课程管理 */
      // 添加课程
      {
        path: '/course/create',
        name: 'course-create',
        component: () => import(/* webpackChunkName: 'course-create' */ '@/views/course/create.vue'),
        meta: {
          title: '课程管理'
        }
      },
      // 编辑课程
      {
        path: '/course/:courseId/edit',
        name: 'course-edit',
        component: () => import(/* webpackChunkName: 'course-edit' */ '@/views/course/edit.vue'),
        props: true,
        meta: {
          title: '课程管理'
        }
      },
      // 内容管理
      {
        path: '/course/:courseId/section',
        name: 'course-section',
        component: () => import(/* webpackChunkName: 'course-section' */ '@/views/course/section.vue'),
        props: true,
        meta: {
          title: '课程管理'
        }
      },
      // 上传视频
      {
        path: '/course/:courseId/video',
        name: 'course-video',
        component: () => import(/* webpackChunkName: 'course-video' */ '@/views/course/video.vue'),
        props: true,
        meta: {
          title: '课程管理'
        }
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
