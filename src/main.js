import Vue from 'vue'
import App from './App.vue'

// 导入抽取的路由
import router from './router/router.js'

// 导入仓库
import store from './store/store.js';

// 导入Element -ui
import ElementUI from 'element-ui';
// 导入Element-ui的样式
import 'element-ui/lib/theme-chalk/index.css';

// 导入自己的全局样式
import './style/base.css'

// use一下
Vue.use(ElementUI)

Vue.config.productionTip = false

// 导入全局过滤器 必须在new Vue之前
// 只是为了执行 导入即可
import './filters/filters.js'

// 导入自定义指令 必须在 new Vue实例之前
// 只是为了执行而已
import './directive/directive.js'

new Vue({
  render: h => h(App),
  // 挂载到Vue实例 - 路由
  router,
  // 挂载到vue实例 - 仓库
  store
}).$mount('#app')

