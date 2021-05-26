import Vue from 'vue'
import App from './App'
Vue.config.productionTip = false
App.mpType = 'app'
import {request} from './utils/js/request.js'
Vue.prototype.$request = request
 // 设置全局请求方法
const app = new Vue({
    ...App
})
app.$mount()
// 映射 另存
Vue.prototype.$globalData= getApp().globalData