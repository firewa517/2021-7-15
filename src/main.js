// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

import './assets/css/reset.css'
//全局引入element-ui
import ElementUI from 'element-ui'
//全局引入element-ui的样式
import 'element-ui/lib/theme-chalk/index.css'

//全局引入axios插件
/* import axios from 'axios'
Vue.prototype.$axios = axios */

//在main.js中引入echarts
/* import Echarts from 'echarts'
//把echarts挂载到vue实例上
//每一个组件都可以用到数据图表
Vue.prototype.echarts = Echarts */

import store from './store'

Vue.use(ElementUI)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
