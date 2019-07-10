import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'           //引入axios请求数据
import VueAxios from 'vue-axios'
import './assets/css/common.css'
import './assets/less/common.less'
//插件
import AlertPlugin from 'vux/src/plugins/alert'
import WechatPlugin from 'vux/src/plugins/wechat'
import ConfirmPlugin from 'vux/src/plugins/confirm'
import LoadingPlugin from 'vux/src/plugins/loading'
import ToastPlugin from 'vux/src/plugins/toast'
Vue.use(AlertPlugin)
Vue.use(WechatPlugin)
Vue.use(ConfirmPlugin)
Vue.use(LoadingPlugin)
Vue.use(ToastPlugin)
Vue.use(VueAxios, axios)
Vue.config.productionTip = false
//通过components下的index.js文件导入组件
import components from './components/index'
//对导入的组件进行全局组件注册
Object.keys(components).forEach((key) => {
  Vue.component(key, components[key])
});

// router.beforeEach((to, from, next) => {
//   console.log(to, from, next)
// })
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

