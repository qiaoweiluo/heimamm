<template>
  <div class="subject-container">
    <!-- 头部 -->
    <el-card>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="学科编号">
          <el-input v-model="formInline.user"></el-input>
        </el-form-item>
        <el-form-item label="学科名称" class="more-width">
          <el-input v-model="formInline.user"></el-input>
        </el-form-item>
        <el-form-item label="创建者">
          <el-input v-model="formInline.user"></el-input>
        </el-form-item>
        <el-form-item label="状态" class="more-width">
          <el-select v-model="formInline.region" placeholder="请选择状态">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button>清除</el-button>
          <el-button type="primary" icon="el-icon-plus">新增企业</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 内容 -->
    <el-card class="main-card">
      <el-table :data="tableData" style="width: 100%" stripe border>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="id" label="学科标号"></el-table-column>
        <el-table-column prop="name" label="学科名称"></el-table-column>
        <el-table-column prop="short_name" label="简称"></el-table-column>
        <el-table-column prop="creater" label="创建者"></el-table-column>
        <el-table-column prop="create_time" label="创建日期"></el-table-column>
        <!-- 自定义列表 1 插槽-->
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status==0" class="red">禁用</span>
            <span v-else>启用</span>
          </template>
        </el-table-column>
        <!-- 自定义列表 2 插槽-->
        <el-table-column label="操作">
          <!-- slot-scope="scope" -->
          <template slot-scope="scope">
            <el-button type="text" >编辑</el-button>
            <el-button type="text">禁用</el-button>
            <el-button type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        background
        :current-page="1"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="36"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
// 导入学科api
import { subjectApi } from "../../../api/api.js";
export default {
  name: "subject",
  data() {
    return {
      formInline: {},
      tableData: [],
      // 页码
      page: 1,
      // 页容量
      limit: 10
    };
  },
  methods: {
    // handleEdit(data, index) {
    //   window.console.log(index, data);
      
    // },
    handleDelete(index, row) {
      window.console.log(index, row);
      this.tableData.splice(index, 1);
    }
  },
  // 生命钩子
  created() {
    subjectApi.list({}).then(res => {
      // window.console.log(res);
      this.tableData = res.data.data.items;
    });
  }
};
</script>

<style lang="less">
.subject-container {
  .el-input__inner {
    width: 100px;
  }
  .more-width {
    .el-input__inner {
      width: 150px;
    }
  }

  // 分页器的样式
  .el-pagination {
    text-align: center;
    margin-top: 30px;
  }
  // card的样式
  .main-card {
    margin-top: 20px;
  }
}

.red {
  color: red;
}
</style>
