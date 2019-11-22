<template>
  <el-container class="index-container">
    <el-header class="header">Header</el-header>
    <el-container>
      <el-aside width="200px" class="aside">Aside</el-aside>
      <el-main class="main">Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "index"
};
</script>

<style lang="less">
.index-container{
    height: 100%;
    .header{
        background-color: orange;
    }
    .aside{
        background: skyblue;
    }
    .main{
        background-color: hotpink;
    }
}
</style>
