<template>
  <div class="questionList">
    <!-- 头部 -->
    <el-card>
      <!-- 行内表单 -->
      <el-form :inline="true" ref="formInline" :model="formInline" class="demo-form-inline">
        <el-form-item label="学科">
          <el-select v-model="formInline.subject" placeholder="请选择学科">
            <el-option label="JavaScript" value="JavaScript"></el-option>
            <el-option label="前端" value="前端"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="阶段">
          <el-select v-model="formInline.step" placeholder="请选择阶段">
            <el-option label="初级" value="初级"></el-option>
            <el-option label="中级" value="中级"></el-option>
            <el-option label="高级" value="高级"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业">
          <el-select v-model="formInline.enterprise" placeholder="请选择企业">
            <el-option label="黑马" value="黑马"></el-option>
            <el-option label="阿里" value="阿里"></el-option>
            <el-option label="京东" value="京东"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="题型">
          <el-select v-model="formInline.type" placeholder="请选择题型">
            <el-option label="单选" value="单选"></el-option>
            <el-option label="多选" value="多选"></el-option>
            <el-option label="简答" value="简答"></el-option>
          </el-select>
        </el-form-item>
        <!-- 第二行开始 -->
        <el-form-item label="难度">
          <el-select v-model="formInline.difficulty" placeholder="请选择难度">
            <el-option label="简单" value="简单"></el-option>
            <el-option label="一般" value="一般"></el-option>
            <el-option label="困难" value="困难"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="formInline.creater"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="formInline.status" placeholder="请选择状态">
            <el-option label="启用" value="启用"></el-option>
            <el-option label="禁用" value="禁用"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-select v-model="formInline.status" placeholder="请选择日期">
            <el-option label="启用" value="启用"></el-option>
            <el-option label="禁用" value="禁用"></el-option>
          </el-select>
        </el-form-item>
        <!-- 第三行开始 -->
        <el-form-item label="标题" class="title">
          <el-input v-model="formInline.title"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button @click="clear">清除</el-button>
          <el-button type="primary" icon="el-icon-plus">新增学科</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 内容 -->
    <el-card class="main-card">
      <!-- 表格 -->
      <el-table :data="tableData" style="width: 100%" stripe border>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="title" label="题目"></el-table-column>
        <el-table-column label="学科.阶段">
          <template slot-scope="scope">{{ scope.row.subject_name}}. {{ scope.row.step}}</template>
        </el-table-column>
        <el-table-column prop="type" label="题型"></el-table-column>
        <el-table-column prop="enterprise_name" label="企业"></el-table-column>
        <el-table-column prop="creater" label="创建者"></el-table-column>
        <el-table-column label="状态" prop="status">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0" class="red">禁用</span>
            <span v-else>启用</span>
          </template>
        </el-table-column>
        <el-table-column label="访问量" prop="reads"></el-table-column>
        <el-table-column label="操作">
          <!-- 插槽 -->
          <template slot-scope="scope">
            <el-button @click="showEdit(scope.row)" type="text">编辑</el-button>
            <el-button
              @click="status(scope.row)"
              type="text"
            >{{ scope.row.status === 1 ? "禁用" : "启用" }}</el-button>
            <el-button v-power="['管理员']" @click="remove(scope.row)" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="pageSizes"
        :page-size="limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
// 导入 接口
import { questionList } from "../../../api/api.js";
export default {
  name: "questionList",
  data() {
    return {
      // 筛选的表格
      formInline: {},
      // 数据
      tableData: [],
      // 页码
      page: 1,
      // 页容量
      limit: 10,
      // 页码数组
      pageSizes: [3, 6, 9],
      // 总条数
      total: 0
    };
  },
  //   生命周期钩子
  created() {
    // 调用接口
    questionList.list({}).then(res => {
    //   window.console.log(res);
      // 赋值给table
      this.tableData = res.data.data.items;
      // 保存 总条数
      this.total = res.data.data.pagination.total;
    });
  },
  methods: {
    // 获取数据的逻辑
    getList() {
      // 调用接口 传递筛选条件
      questionList
        .list({ page: this.page, limit: this.limit, ...this.formInline })
        .then(res => {
          // 赋值给table
          this.tableData = res.data.data.items;
          // 重新设置页容量即可
          this.total = res.data.data.pagination.total;
        });
    },
    // 筛选逻辑
    search() {
      // 跳转到第一页
      this.page = 1;
      // 获取数据
      this.getList();
    },
    // 清除按钮点击事件
    // resetForm(formInline) {
    //   this.$refs[formInline].resetFields();
    // }
    // 注意采用vue自带的方法 需要在data里面设置一堆属性 不太方便
    // 可以直接设置一点击事件 空对象赋值
    clear() {
      this.formInline = {};
    },
    // 页容量改变
    handleSizeChange(size) {
      // 保存起来
      this.limit = size;
      window.console.log(size);
      // 修改页码
      // 去第一页
      this.page = 1;
      // 重新获取数据
      this.getList();
    },
    // 页码改变
    handleCurrentChange(current) {
      // 保存页码
      this.page = current;
      // 重新获取数据
      this.getList();
    }
  }
};
</script>


<style lang="less">
.questionList {
  .el-card__body {
    padding: 33px 0 43px 41px;
    .el-form--inline {
      .el-form-item {
        margin-right: 30px;
        .el-input__inner {
          width: 150px;
        }
        .el-form-item__label {
          padding-right: 31px;
        }
      }
      .title {
        margin-right: 11px;
        .el-input {
          .el-input__inner {
            width: 388px;
          }
        }
      }
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
    .el-card__body > div div {
      text-align: center;
    }
  }
  // span 变红
  .red {
    color: red;
  }

  // 对话框样式
  .el-dialog {
    width: 600px;

    .el-dialog__header {
      text-align: center;
      background: linear-gradient(to right, #01c5fa, #1394fa);

      .el-dialog__title {
        color: white;
      }
    }

    .el-dialog__body {
      .el-form-item__label {
        width: 61px;
        height: 16px;
        font-size: 15px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(76, 78, 84, 1);
      }
      .el-input__inner {
        width: 100%;
      }
    }
    .dialog-footer {
      text-align: center;
    }
  }
}
</style>
