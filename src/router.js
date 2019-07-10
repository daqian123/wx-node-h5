import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
export default new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('./views/Index.vue'),
      children: [
        {
          path: '/waterfalls',
          name: 'waterfalls',
          meta: {
            title: '瀑布流'
          },
          component: () => import('./views/Waterfalls.vue')
        },
        {
          path: '/cropImg',
          name: 'cropImg',
          meta: {
            title: '截图'
          },
          component: () => import('./views/CropImg.vue')
        },
        {
          path: '/home',
          name: 'home',
          meta: {
            title: '主页'
          },
          component: () => import('./views/Home.vue')
        },
        {
          path: '/wrapper',
          name: 'wrapper',
          meta: {
            title: '滚动'
          },
          component: () => import('./views/Wrapper.vue')
        }
      ]
    },

    {
      path: '*',
      meta: {
        title: '页面不存在'
      },
      component: () => import('./views/404.vue')
    }
  ]
})
