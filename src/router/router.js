// 导入vue-router
import VueRouter from 'vue-router'
// 导入vue
import Vue from 'vue';

// use
Vue.use(VueRouter)

// 导入 登录页面组件
import login from '../views/login/login.vue'

// 规则
const routes = [
   { path: "/login",
    component: login
}
]
// 创建路由实例
const router = new VueRouter({
    routes
})
// 挂载到路由实例上
// 暴露出去

// 类似于 module.exports = routera
export default router;