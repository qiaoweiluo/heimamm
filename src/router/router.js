// 导入vue-router
import VueRouter from "vue-router";
// 导入vue 用就要导入
import Vue from "vue";

// 导入element ui 弹框
import { Message } from "element-ui";

// 导入 获取token的方法
import { getToken } from '../utils/token';

// 导入 获取用户信息的逻辑
import { userInfo } from "../api/api.js";

// 导入 仓库
import store from "../store/store.js";

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



// 路由规则
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
    meta: {
      roles:['管理员','老师','学生']
    },
    // 嵌套路由 
    children: [
      {
        // 匹配的是 /index/dataRecord
        path: "dataRecord", 
        component: dataRecord,
        meta:{
          roles:['管理员','老师']
        }
      },
      {
        // 匹配的是 /index/userlist
        path: "userList", 
        component: userList,
        meta:{
          roles:['管理员']
        }
      },
      {
        // 匹配的是 /index/questionList
        path: "questionList", 
        component: questionList,
        meta:{
          roles:['管理员','老师']
        }
      },
      {
        // 匹配的是 /index/enterprise
        path: "enterprise", 
        component: enterprise,
        meta:{
          roles:['管理员','老师']
        }
      },
      {
        // 匹配的是 /index/subject
        path: "subject", 
        component: subject,
        meta:{
          roles:['管理员','老师','学生']
        }
      },
    ]
  }
];

// 创建路由示例
const router = new VueRouter({
  routes
});

// 定义白名单(不登陆也可以访问) 后续直接使用性能好一些
const whitePaths = ["/login"];
// 导航守卫
router.beforeEach((to, from, next) => {
   // 判断是否存在 白名单中 to.path 路径比如 /index /login
  if(whitePaths.indexOf(to.path) != -1) {
  //  放走
  return next();
  }
  // 登录状态 token
  if(getToken()) {
    // 存在
    // 调用接口验证对错 异步操作
    // 这里放置return是为了阻断异步操作代码的执行 不是为了拿返回值
    return  userInfo().then(res => {
      // 注意 发请求是异步的  需要把next()放里面
      // 才不会出现伪造token的情况下 依旧会进到index页面停留一会才退出去
      // 用户信息获取成功 token木有问题
      // 高级用户强打token 
      store.commit("CHANGEINFO", res.data.data);
      /*
        两次获取数据的目的: 
          1. 判断token
          2. 解决 登录后再开一个页面 只有token 没有用户的登录信息
      */
     if(res.data.data.status===0){
      // 禁用
      Message.warning("请等待管理员启用你！！");
      return next("/login");
    }

    // 用户启用状态 权限判断 includes可以代替indexOf
    if(to.meta.roles.indexOf(res.data.data.role)==-1){
      // 不存在 说明 没有权限
      Message.warning("兄die，你不允许访问这个页面");
      return 
    }

      // 解决伪造token进页面的问题
      // return next(); return上移
      next();
    })
    // 放走
    // 放外面是不会等请求回来再执行的
    // return next();
  }

  // 说明不是白名单 // 没登录，同时木有token
  // 因为上面代码最后的 阻断 return 放里面去了 
  // 代码继续往后走 所以强打进入页面 也会弹出  请先登录
  Message("请先登录");
  next("/login")
})

// 挂载到Vue实例上
// 暴露出去
// 类似于 module.exports = routera
export default router;
