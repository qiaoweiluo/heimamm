// 导入vue-router
import VueRouter from "vue-router";
// 导入vue 用就要导入
import Vue from "vue";
// use
Vue.use(VueRouter);

// 导入 登录页面组件
import login from "../views/login/login.vue";
// 导入 首页页面组件
import index from "../views/index/index.vue";

// 嵌套路由的组件导入



// 企业列表
import enterprise from '../views/index/enterprise/enterprise.vue';

// 学科列表
import subject from '../views/index/subject/subject.vue';


// 规则
const routes = [
  // 登录组件规则
  {
    path: "/login",
    component: login
  },
  // 首页组件规则
  {
    path: "/index",
    component: index,
    // 嵌套路由 
    children: [
      
      {
        // 匹配的是 /index/subject
        path: "subject", 
        component: subject
      },
      {
        // 匹配的是 /index/enterprise
        path: "enterprise", 
        component: enterprise
      }
    ]
  }
];

// 创建路由示例
const router = new VueRouter({
  routes
});

// 挂载到Vue实例上
// 暴露出去
// 类似于 module.exports = routera
export default router;
