// 导入Vue
import Vue from 'vue'

// 导入仓库
import store from '../store/store.js'

// 添加指令
Vue.directive('power',{
    inserted(el,bind){
        //  window.console.log(el);
        //  window.console.log(bind);
        //  window.console.log(store.state.userInfo.role);
         if(bind.value.indexOf(store.state.userInfo.role)==-1){
             // 当前的角色不允许 使用这个功能
             // 直接移除
             // 采用原生的dom语法 因为 el是dom元素
             el.parentNode.removeChild(el)
         }
    }
})
// 不用暴露 这只是注册 没有东西返回 只有执行了就有用
// 执行导入即可