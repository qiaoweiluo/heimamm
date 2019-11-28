// 导入Vue
import Vue from 'vue'
// 导入moment
import moment from 'moment'

Vue.filter('formatTime_global',(value)=>{
    return moment(value).format("YYYY年MM月DD日")
})
// 需要在main.js里面执行一次
