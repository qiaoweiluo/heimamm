// 导入Vue
import Vue from 'vue'
// 导入Vuex
import Vuex from 'vuex'
// use一下
Vue.use(Vuex)
// 创建仓库
const store = new Vuex.Store({
    // 数据
    // 点语法不推荐 在插件中跟踪不到数据的变更
    state:{
        // 用户信息 
        userInfo:undefined
    },
    // 修改数据的方法 建议全部大写
    mutations: {
        // 全部大写 目的和普通方法相区别 非必须
        CHANGEINFO(state, info) {
            // 直接保存
            state.userInfo = info;
        }
    }
})
// 暴露出去
export default store;