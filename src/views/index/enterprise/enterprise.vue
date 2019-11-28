<template>
  <div class="enterprise-cintainer">
    <!-- 头部 -->
    <el-card>
      <el-form :inline="true" :model="formInline" class="demo-form-inline" ref="formInline">
        <el-form-item label="企业编号" prop="eid">
          <el-input v-model="formInline.eid"></el-input>
        </el-form-item>
        <el-form-item label="企业名称" prop="name">
          <el-input v-model="formInline.name" class="more-width"></el-input>
        </el-form-item>
        <el-form-item label="创建者" prop="creater">
          <el-input v-model="formInline.creater"></el-input>
        </el-form-item>
        <el-form-item label="状态" class="more-width" prop="status">
          <el-select v-model="formInline.status" placeholder="请选择状态">
            <el-option label="启用" :value="1"></el-option>
            <el-option label="禁用" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm('formInline')">清除</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="el-icon-plus" @click="addFormVisible = true">新增企业</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 内容 -->
    <el-card class="main-card">
      <el-table :data="tableData" style="width: 100%" stripe border>
        <el-table-column type="index" label="序号" width="60px"></el-table-column>
        <el-table-column prop="eid" label="企业编号" width="180"></el-table-column>
        <el-table-column prop="name" label="企业名称" width="180"></el-table-column>
        <el-table-column prop="tag" label="所属领域"></el-table-column>
        <el-table-column prop="creater" label="创建者"></el-table-column>
        <el-table-column prop="create_time" label="创建日期" width="180px">
          <template slot-scope="scope">
            <!-- 管道服务 -->
            {{ scope.row.create_time | formatTime_global }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0" class="red">禁用</span>
            <span v-else>启用</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template slot-scope="scope">
            <!-- 始终为button设置type值 -->
            <el-button size="mini" type="text" @click="editShow(scope.row)">编辑</el-button>
            <!-- 利用三元表达式 根据状态码status取反 从而实现启用和禁用的切换 上面0为禁用 下面0 为启用 -->
            <el-button
              size="mini"
              type="text"
              @click="status(scope.row)"
            >{{ scope.row.status === 1 ? "禁用" : "启用" }}</el-button>
            <el-button size="mini" type="text" @click="remove(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分页器 -->
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="pageSizes"
      :page-size="500"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 新增按钮的对话框 -->
    <el-dialog title="企业编号" :visible.sync="addFormVisible">
      <el-form :model="addForm" ref="addForm" :rules="rules">
        <el-form-item label="企业编号" prop="eid" :label-width="formLabelWidth">
          <el-input v-model="addForm.eid" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="企业名称" prop="name" :label-width="formLabelWidth">
          <el-input v-model="addForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属领域" :label-width="formLabelWidth">
          <el-select v-model="addForm.tag" placeholder="请选择领域">
            <el-option label="金融" value="金融"></el-option>
            <el-option label="互联网" value="互联网"></el-option>
            <el-option label="电商" value="电商"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业简称" :label-width="formLabelWidth">
          <el-input v-model="addForm.short_name" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 文本域输入框 -->
        <el-form-item label="企业简介" :label-width="formLabelWidth">
          <el-input v-model="addForm.intro" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="企业备注" :label-width="formLabelWidth">
          <el-input v-model="addForm.remark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAdd">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑按钮的对话框 -->
    <el-dialog title="企业编号" :visible.sync="editFormVisible">
      <el-form :model="editForm" ref="editForm" :rules="rules">
        <el-form-item label="企业编号" prop="eid" :label-width="formLabelWidth">
          <el-input v-model="editForm.eid" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="企业名称" prop="name" :label-width="formLabelWidth">
          <el-input v-model="editForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属领域" :label-width="formLabelWidth">
          <el-select v-model="editForm.tag" placeholder="请选择领域">
            <el-option label="金融" value="金融"></el-option>
            <el-option label="互联网" value="互联网"></el-option>
            <el-option label="电商" value="电商"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业简称" :label-width="formLabelWidth">
          <el-input v-model="editForm.short_name" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 文本域输入框 -->
        <el-form-item label="企业简介" :label-width="formLabelWidth">
          <el-input v-model="editForm.intro" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="企业备注" :label-width="formLabelWidth">
          <el-input v-model="editForm.remark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="eitFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEdit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 导入企业接口的api方法
import { enterprise } from "../../../api/api.js";
export default {
  name: "enterprise",
  data() {
    return {
      // 头部筛选表格
      formInline: {},
      // 列表表格数据
      tableData: [],
      // 页码
      page: 1,
      // 页容量
      limit: 10,
      // 页码数组
      pageSizes: [10, 20, 30, 40],
      // 数据总条数
      total: 0,
      // 新增对话框默认隐藏
      addFormVisible: false,
      // 新增对话框表单数据
      addForm: {},
      formLabelWidth: "120px",
      // 表单验证规则
      rules: {
        eid: [
          {
            required: true,
            message: "请输入企业编号",
            trigger: "blur"
          }
        ],
        name: [
          {
            required: true,
            message: "请输入企业名称",
            trigger: "blur"
          }
        ]
      },
      // 编辑表单的数据
      editForm: {},
      // 编辑表单是否显示
      editFormVisible: false
    };
  },
  // 生命周期钩子获取列表数据 最早拿到data数据的钩子
  created() {
    enterprise.list({}).then(res => {
      //成功回调
      // window.console.log(res);
      this.tableData = res.data.data.items;
      this.total = res.data.data.pagination.total;
    });
  },
  methods: {
    // 刷新页面
    getList() {
      enterprise
        .list({
          page: this.page,
          limit: this.limit,
          // 拓展运算符
          ...this.formInline
        })
        .then(res => {
          // window.console.log(res)
          // 赋值给table
          this.tableData = res.data.data.items;
          this.total = res.data.data.pagination.total;
        });
    },
    // 删除按钮
    remove(data) {
      window.console.log(data);
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 调用接口删除服务器上的数据
          enterprise
            .remove({
              id: data.id
            })
            .then(res => {
              // window.console.log(res);
              if (res.data.code === 200) {
                // 根据返回的状态码来判断是否删除成功
                // 然后重新刷新页面
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
    },
    // 根据搜索按钮提交的筛选条件搜索
    search() {
      // 跳转第一页
      this.page = 1;
      // 重新刷新数据
      this.getList();
    },
    // 页容量改变
    handleSizeChange(size) {
      // 保存起来
      this.limit = size;
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
    },
    // 提交新增表单
    submitAdd() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          // 成功 调接口
          enterprise.add(this.addForm).then(res => {
            if (res.data.code === 200) {
              this.addFormVisible = false;
              this.getList();
            }
          });
        } else {
          // console.log("error submit!!");
          this.$message.warning("数据添加错误");
          return false;
        }
      });
    },
    // 企业状态的启用禁用切换
    status(data) {
      // 接受传过来的一行数据
      enterprise
        .status({
          id: data.id,
          status: data.status === 1 ? 0 : 1
        })
        .then(res => {
          // window.console.log(res)
          if (res.data.code === 200) {
            this.getList();
          }
        });
    },
    // 点击编辑按钮
    // 浅拷贝问题还未解决
    editShow(data) {
      // window.console.log(data);
      // 弹出编辑对话框
      this.editFormVisible = true;
      // 修改数据 浅拷贝
      this.editForm = data;
    },
    // 保存修改
    submitEdit() {
      // 编辑表单
      this.$refs.editForm.validate(valid => {
        if (valid) {
          // 成功 调接口
          // 将这行新的信息发送过去
          enterprise.edit(this.editForm).then(res => {
            if (res.data.code === 200) {
              this.editFormVisible = false;
              this.getList();
            }
          });
        } else {
          this.$message.warning("编辑失败");
          return false;
        }
      });
    },
    // 清除按钮点击事件
    resetForm(formInline) {
      this.$refs[formInline].resetFields();
    }
  }
};
</script>

<style lang="less">
.enterprise-cintainer {
  .el-input__inner {
    width: 100px;
  }
  .more-width {
    .el-input__inner {
      width: 150px;
    }
  }
  // 内容盒子的样式
  .main-card {
    margin-top: 20px;
  }
  // span 变红
  .red {
    color: red;
  }
  // 分页器的样式
  .el-pagination {
    text-align: center;
    margin-top: 30px;
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