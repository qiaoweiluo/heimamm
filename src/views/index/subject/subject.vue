<template>
  <div class="subject-container">
    <!-- 头部 -->
    <el-card>
      <!-- 行内 表单 -->
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="学科编号">
          <el-input v-model="formInline.rid"></el-input>
        </el-form-item>
        <el-form-item label="学科名称" class="more-width">
          <el-input v-model="formInline.name"></el-input>
        </el-form-item>
        <el-form-item label="创建者">
          <el-input v-model="formInline.creater"></el-input>
        </el-form-item>
        <el-form-item label="状态" class="more-width">
          <!-- 表单元素数据的绑定 是v-model -->
          <el-select v-model="formInline.status" placeholder="请选择状态">
            <el-option label="启用" :value="1"></el-option>
            <el-option label="禁用" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button>清除</el-button>
          <el-button type="primary" icon="el-icon-plus" @click="showSubject = true">新增学科</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 内容 -->
    <el-card class="main-card">
      <!-- 表格 -->
      <el-table :data="tableData" style="width: 100%" stripe border>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="rid" label="学科编号"></el-table-column>
        <el-table-column prop="name" label="学科名称"></el-table-column>
        <el-table-column prop="short_name" label="简称"></el-table-column>
        <el-table-column prop="creater" label="创建者"></el-table-column>
        <el-table-column prop="create_time" label="创建日期"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0" class="red">禁用</span>
            <span v-else>启用</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <!-- 插槽 -->
          <template slot-scope="scope">
            <el-button type="text">编辑</el-button>
            <el-button type="text">禁用</el-button>
            <!-- 删服务器数据 不用加index -->
            <el-button type="text" @click="remove(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        background
        :current-page="page"
        :page-sizes="pageSizes"
        :page-size="limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </el-card>

    <!-- 学科编号  对话框 -->
    <el-dialog title="新增学科" :visible.sync="showSubject">
      <el-form :addRules="addRules" ref="ruleForm">
        <el-form-item label="学科编号" prop="number" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="学科名称" prop="designation" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="学科简称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="学科简介" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="学科备注" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showSubject = false">取 消</el-button>
        <el-button type="primary" @click="showSubject = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 导入 接口
import { subject } from "../../../api/api.js";

export default {
  name: "subject",
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
      pageSizes: [5, 10, 15, 20],
      // 总条数
      total: 0,
      // 新增表单时候显示
      showSubject: false,
      // 新增表单数据
      form: {
        name: ""
      },
      // label的宽度不设置会自动设置
      formLabelWidth: "120px",
      // 表单验证规则
      addRules: {
        number: [
          { required: true, message: "请输入学科编号", trigger: "blur" }
        ],
        designation: [
          { required: true, message: "请输入学科名称", trigger: "blur" }
        ]
      }
    };
  },
  // 生命周期钩子
  created() {
    // 调用接口
    subject
      .list({
        page: this.page,
        limit: this.limit
      })
      .then(res => {
        // window.console.log(res);
        // 赋值给table
        this.tableData = res.data.data.items;
        // 保存 总条数
        this.total = res.data.data.pagination.total;
      });
  },
  // 方法
  methods: {
    // 获取数据的逻辑
    getList() {
      // 调用接口 传递筛选条件
      // ES6的拓展运算符
      subject
        .list({ page: this.page, limit: this.limit, ...this.formInline })
        .then(res => {
          // 赋值给table
          this.tableData = res.data.data.items;
          // 重新设置页容量即可
          this.total = res.data.data.pagination.total;
        });
    },
    search() {
      // 跳转到第一页
      this.page = 1;
      // 获取数据
      this.getList();
    },
    // 页容量改变
    handleSizeChange(size) {
      // 保存起来
      this.limit = size;
      this.page = 1;
      // 重新获取数据
      this.search();
    },
    // 页容量改变
    handleCurrentChange(current) {
      // 保存页码
      this.page = current;
      // 重新获取数据
      this.getList();
    },
    // 编辑文章

    // 删除列表
    remove(data) {
      // window.console.log(data);
      // 提示 Messagebox 弹框
      this.$confirm("此操作将永久删除该学科, 确定?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 接口调用
          subject
            .remove({
              id: data.id
            })
            .then(res => {
              // window.console.log(res);
              if (res.data.code == 200) {
                // 提示
                // this.$message.success(res.data.message)
                // 重新获取数据
                this.getList();
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
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
