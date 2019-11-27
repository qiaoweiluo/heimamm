<template>
  <div class="enterprise-cintainer">
    <!-- 头部 -->
    <el-card>
      <el-form :inline="true" :model="formInline" class="demo-form-inline" ref="formInline">
        <el-form-item label="用户名称" prop="name">
          <el-input v-model="formInline.name"></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input v-model="formInline.email" class="more-width"></el-input>
        </el-form-item>
        <el-form-item label="角色" class="more-width" prop="status">
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
           <!-- @click="addFormVisible = true" -->
          <el-button type="primary" class="el-icon-plus" @click="addFormVisible = true">新增用户</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 内容 -->
    <el-card class="main-card">
      <el-table :data="tableData" style="width: 100%" stripe border>
        <el-table-column type="index" label="序号" width="60px"></el-table-column>
        <el-table-column prop="name" label="用户名" width="180"></el-table-column>
        <el-table-column prop="phone" label="电话" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="role" label="角色"></el-table-column>
        <el-table-column prop="remark" label="备注" width="180px"></el-table-column>
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
    <el-dialog title="新增用户" :visible.sync="addFormVisible">
      <el-form :model="addForm" ref="addForm" :rules="rules" status-icon>
        <el-form-item label="用户名" prop="name" :label-width="formLabelWidth">
          <el-input v-model="addForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" :label-width="formLabelWidth">
          <el-input v-model="addForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone" :label-width="formLabelWidth">
          <el-input v-model="addForm.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role" :label-width="formLabelWidth">
          <el-select v-model="addForm.role" placeholder="请选择角色">
            <el-option label="管理员" value="管理员"></el-option>
            <el-option label="老师" value="老师"></el-option>
            <el-option label="学生" value="学生"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status" :label-width="formLabelWidth">
          <el-select v-model="addForm.status" placeholder="请选择状态">
            <el-option label="启用" value="启用"></el-option>
            <el-option label="禁用" value="禁用"></el-option>
          </el-select>
        </el-form-item>
        <!-- 文本域输入框 -->
        <el-form-item label="用户备注" prop="remark" :label-width="formLabelWidth">
          <el-input v-model="addForm.remark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAdd">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑按钮的对话框 -->
    <el-dialog title="编辑用户" :visible.sync="editFormVisible">
      <el-form :model="editForm" ref="editForm" :rules="rules">
        <el-form-item label="用户名" prop="name" :label-width="formLabelWidth">
          <el-input v-model="editForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" :label-width="formLabelWidth">
          <el-input v-model="editForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone" :label-width="formLabelWidth">
          <el-input v-model="editForm.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role" :label-width="formLabelWidth">
          <el-select v-model="editForm.role" placeholder="请选择角色">
            <el-option label="管理员" value="管理员"></el-option>
            <el-option label="学生" value="学生"></el-option>
            <el-option label="老师" value="老师"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status" :label-width="formLabelWidth">
          <el-select v-model="addForm.status" placeholder="请选择状态">
            <el-option label="禁用" value="禁用"></el-option>
            <el-option label="启用" value="启用"></el-option>
          </el-select>
        </el-form-item>
        <!-- 文本域输入框 -->
        <el-form-item label="用户备注" prop="remark" :label-width="formLabelWidth">
          <el-input v-model="editForm.remark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEdit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
  
  <script>
// 导入获取用户列表的方法
import { user } from "../../../api/api.js";
export default {
  name: "user",
  data() {
    /*
      1.发现问题 点击新增按钮 手机号码或者邮箱任意一个输入的格式不对 提交表单时会被删掉token 回到登录页
      2.分析问题 除了前端 后台接受数据时也会有一个格式验证 手机号和邮箱格式不对 依旧会报错
                而且 我们这里的报错的状态码单一 被拦截器拦截以后 会执行删除token的操作
      3.解决问题 在新增按钮的对话框里面给手机号和邮箱设置校验规则 保证发出去的数据格式正确
    */
    // 定义手机号校验的规则
    const checkPhone = (rules, value, callback) => {
      // value是值
      if (!value) {
        callback(new Error("手机号不能为空"));
      } else {
        // 格式验证
        const reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
        // 验证
        if (reg.test(value)) {
          // 对的
          callback();
        } else {
          // 错误
          callback(new Error("手机号格式不对哦"));
        }
      }
    };
    // 定义邮箱的校验规则
    const checkEmail = (rules, value, callback) => {
      // value是值
      if (!value) {
        callback(new Error("邮箱不能为空"));
      } else {
        // 格式验证
        const reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
        // 验证
        if (reg.test(value)) {
          // 对的
          callback();
        } else {
          // 错误
          callback(new Error("邮箱格式不对哦"));
        }
      }
    };
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
      // 新增表单的数据
      addForm: {},
      formLabelWidth: "120px",
      // 编辑表单的数据
      editForm: {},
      // 编辑表单是否显示
      editFormVisible: false,
      // 表单验证规则
      rules: {
        name: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          }
        ],
        email: [
          {
            required: true,
            message: "请输入邮箱",
            trigger: "blur"
          },
          { validator: checkEmail }
        ],
        phone: [
          {
            required: true,
            message: "请输入电话",
            trigger: "blur"
          },
          { validator: checkPhone }
        ],
        role: [
          {
            required: true,
            message: "请选择角色",
            trigger: "blur"
          }
        ]
      }
    };
  },
  // 生命周期钩子获取列表数据 最早拿到data数据的钩子
  created() {
    user.list({}).then(res => {
      //成功回调
      // window.console.log(res);
      this.tableData = res.data.data.items;
      this.total = res.data.data.pagination.total;
    });
  },
  methods: {
    // 刷新页面
    getList() {
      user
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
      // window.console.log(data);
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 调用接口删除服务器上的数据
          user
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
    // 清除按钮点击事件
    resetForm(formInline) {
      this.$refs[formInline].resetFields();
    },
    
    // 提交新增表单
    submitAdd() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          // 成功 调接口
          window.console.log(this.addForm);
          user.add(this.addForm).then(res => {
            if (res.data.code === 200) {
              this.addFormVisible = false;
              this.getList();
            }
          });
        } else {
          this.$message.warning("数据添加错误");
          return false;
        }
      });
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
    // 企业状态的启用禁用切换
    status(data) {
      // 接受传过来的一行数据
      user
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
          user.edit(this.editForm).then(res => {
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
    }
  }
};
</script>
  
  <style>
</style>