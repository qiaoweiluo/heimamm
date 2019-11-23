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
        <img class="avatar" src="../../assets/avatar.jpg" alt />
        <span class="name">西兰花,您好</span>
        <el-button class="logout" size="mini" type="primary">退出</el-button>
      </div>
    </el-header>
    <!-- 左侧导航栏 -->
    <el-container>
      <!-- 饿了么UI默认300px  -->
      <el-aside class="aside" style="width:auto">
        <el-menu default-active="2"  class="el-menu-vertical-demo" router :collapse="isCollapse">
            <!-- index表示匹配的地址 -->
            <!-- /index/elicon 绝对路径   elicon相对路径-->
          <el-menu-item index="/index/dataRecord">
            <!-- 图标 -->
            <i class="el-icon-pie-chart"></i>
            <span slot="title">数据概览</span>
          </el-menu-item>
          <el-menu-item index="/index/userList">
            <i class="el-icon-user"></i>
            <span slot="title">用户列表</span>
          </el-menu-item>
          <el-menu-item index="/index/questionList">
            <i class="el-icon-edit-outline"></i>
            <span slot="title">题库列表</span>
          </el-menu-item>
          <el-menu-item index="/index/enterprise" >
            <i class="el-icon-office-building"></i>
            <span slot="title">企业列表</span>
          </el-menu-item>
          <el-menu-item index="/index/subject" >
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
export default {
  name: "index",
  data() {
    return {
      isCollapse: false
    };
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
    background-color: hotpink;
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
