<template>
  <el-container class="index-container">
    <!-- 头部 -->
    <el-header class="header">
      <div class="left">
        <!-- 顶部的图标,点击旋转 -->
        <i class="el-icon-s-fold" @click="isCollapse = !isCollapse" :class="{ rotate: isCollapse }"></i>
        <img class="logo" src="../../assets/index-logo.png" alt />
        <span class="title">黑马面面</span>
      </div>
      <div class="right">
        <img class="avatar" :src="getIcon" alt />
        <span class="name">{{ getName }},您好</span>
        <el-button class="logout" @click="logout" size="mini" type="primary">退出</el-button>
      </div>
    </el-header>
    <!-- 左侧导航栏 -->
    <el-container>
      <!-- 饿了么UI默认300px  -->
      <el-aside class="aside" style="width:auto">
        <el-menu default-active="2" class="el-menu-vertical-demo" router :collapse="isCollapse">
          <!-- index表示匹配的地址 -->
          <!-- /index/elicon 绝对路径   elicon相对路径-->
          <el-menu-item index="/index/dataRecord" v-if="['管理员','老师'].indexOf(getRole)!=-1">
            <!-- 图标 -->
            <i class="el-icon-pie-chart"></i>
            <span slot="title">数据概览</span>
          </el-menu-item>
          <el-menu-item index="/index/userList" v-if="['管理员'].indexOf(getRole)!=-1">
            <i class="el-icon-user"></i>
            <span slot="title">用户列表</span>
          </el-menu-item>
          <el-menu-item index="/index/questionList" v-if="['管理员','老师'].indexOf(getRole)!=-1">
            <i class="el-icon-edit-outline"></i>
            <span slot="title">题库列表</span>
          </el-menu-item>
          <el-menu-item index="/index/enterprise" v-if="['管理员','老师'].indexOf(getRole)!=-1">
            <i class="el-icon-office-building"></i>
            <span slot="title">企业列表</span>
          </el-menu-item>
          <el-menu-item index="/index/subject" v-if="['管理员','老师','学生'].indexOf(getRole)!=-1">
            <i class="el-icon-notebook-2"></i>
            <span slot="title">学科列表</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// // 导入 获取token的函数
// import { getToken, removeToken } from "../../utils/token.js";
// 移除 获取token的方法
import { removeToken } from "../../utils/token.js";

// 导入 用户信息方法
// import {userInfo} from '../../api/api.js';

export default {
  name: "index",
  data() {
    return {
      // 是否折叠
      isCollapse: false
      // 头像地址
      // avatar: "",
      // 用户名
      // name: ""
    };
  },
  // 生命周期钩子 token的判断放到路由的导航守卫中去了
  beforeCreate() {
    // // 判断token是否存在
    // const token = getToken();
    // if (!token) {
    //   // 提示用户
    //   this.$message.error("兄dei,你好像没登录,去登个录呗");
    //   // 不存在 去登录页
    //   this.$router.push("/login");
    // }
  },
  // 创建钩子
  created() {
    // userInfo().then(res=>{
    //   // 判断token 伪造token进来
    //   // if(res.data.code===0){
    //   //   // token有问题
    //   //   this.$message.error("小老弟，伪造token，牛逼啊！");
    //   //   // 删除token
    //   //   removeToken();
    //   //   // 去登录页
    //   //   this.$router.push("/login")
    //   //   return
    //   // }
    //   // window.console.log(res);
    //   // 保存到data中
    //   this.avatar = `${process.env.VUE_APP_BASEURL}/${res.data.data.avatar}`
    //   this.name=res.data.data.name
    // })
  },
  methods: {
    // 登出
    logout() {
      this.$confirm("你即将退出这个网站,是否继续?", "提示", {
        confirmButtonText: "狠心离开",
        cancelButtonText: "陪伴",
        type: "warning"
      })
        .then(() => {
          // 删除token
          removeToken();
          // 删除仓库的数据即可
            this.$store.commit("CHANGEINFO",undefined);
          // 去登录页
          this.$router.push("/login");
        })
        .catch(() => {
          // this.$message({type:"",message: ""}) 弹出框提示
          this.$message({
            type: "info",
            message: "陪伴是最长情的告白"
          });
        });
    }
  },
  // 计算属性 仓库 获取用户信息
  computed: {
    // 获取名字
    getName() {
      return this.$store.state.userInfo.name;
    },
    // 获取头像
    getIcon() {
      return (
        process.env.VUE_APP_BASEURL + "/" + this.$store.state.userInfo.avatar
      );
    },
    // 根据角色判断左侧导航栏的显示隐藏 
    // 用户角色
    getRole() {
      return this.$store.state.userInfo.role;
    }
  }
};
</script>

<style lang="less">
.index-container {
  height: 100%;
  .header {
    display: flex;
    justify-content: space-between;
    .left {
      display: flex;
      align-items: center;
      .el-icon-s-fold {
        font-size: 23px;
        margin-right: 22px;
      }
      .logo {
        width: 33px;
        height: 28px;
        margin-right: 11px;
      }
      .title {
        font-size: 22px;
        color: #49a1ff;
      }
    }
    .right {
      display: flex;
      align-items: center;
      .avatar {
        width: 43px;
        height: 43px;
        border-radius: 50%;
        margin-right: 9px;
      }
      .name {
        font-size: 14px;
        margin-right: 38px;
      }
    }
  }
  // .aside {
  //   // background: skyblue;
  // }
  .main {
    background-color: #e8e9ec;
  }
  // 折叠菜单相关的类名
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  .el-icon-s-fold {
    font-size: 40px;
    transition: 0.5s;
  }
  .rotate {
    transform: rotate(-90deg);
  }
}
</style>
