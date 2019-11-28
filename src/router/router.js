// 导入vue-router
import VueRouter from "vue-router";
// 导入vue 用就要导入
import Vue from "vue";

// 导入element ui 弹框
import { Message } from "element-ui";

// 导入 获取token的方法
import { getToken } from '../utils/token';

// 重写push方法 屏蔽 重复跳转错误
// 解决两次访问相同路由地址报错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

// use
Vue.use(VueRouter);

// 导入 登录页面组件
import login from "../views/login/login.vue";
// 导入 首页页面组件
import index from "../views/index/index.vue";

// 嵌套路由的组件导入

// 数据概览
import dataRecord from '../views/index/dataRecord/dataRecord.vue';

// 用户列表
import userList from '../views/index/userList/userList.vue';

// 题库列表
import questionList from '../views/index/questionList/questionList.vue';

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
        // 匹配的是 /index/dataRecord
        path: "dataRecord", 
        component: dataRecord
      },
      {
        // 匹配的是 /index/userlist
        path: "userList", 
        component: userList
      },
      {
        // 匹配的是 /index/edit
        path: "questionList", 
        component: questionList
      },
      {
        // 匹配的是 /index/enterprise
        path: "enterprise", 
        component: enterprise
      },
      {
        // 匹配的是 /index/enterprise
        path: "subject", 
        component: subject
      },
    ]
  }
];

// 创建路由示例
const router = new VueRouter({
  routes
});

// 定义白名单 后续直接使用性能好一些
const whitePaths = ["/login"];
// 导航守卫
router.beforeEach((to, from, next) => {
  if(whitePaths.indexOf(to.path) != -1) {
  //  放走
  return next()
  }
  // 登录状态 token
  if(getToken) {
    // token 存在 放走
    return next();
  }

  // 说明不是白名单
  Message("请先登录");
  next("/login")
})

// 挂载到Vue实例上
// 暴露出去
// 类似于 module.exports = routera
export default router;
