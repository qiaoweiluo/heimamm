import Vue from 'vue'
import App from './App.vue'

// 导入抽取的路由

import router from './router/router.js'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  // 挂载到Vue实例
  router
}).$mount('#app')
