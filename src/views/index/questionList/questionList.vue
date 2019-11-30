<template>
  <div class="questionList">
    <!-- 头部 -->
    <el-card>
      <!-- 行内表单 -->
      <el-form :inline="true" ref="formInline" :model="formInline" class="demo-form-inline">
        <el-form-item label="学科">
          <el-select v-model="formInline.subject" placeholder="请选择学科">
            <el-option
              v-for="item in subjectArr"
              :label="item.name"
              :value="item.id"
              :key="item.id"
            ></el-option>
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
            <el-option
              v-for="item in enterpriseArr"
              :label="item.name"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="题型">
          <el-select v-model="formInline.type" placeholder="请选择题型">
            <el-option label="单选" value="单选"></el-option>
            <el-option label="多选" value="多选"></el-option>
            <el-option label="简答" value="简答"></el-option>
          </el-select>
        </el-form-item>
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
            <el-option label="启用" :value="1"></el-option>
            <el-option label="禁用" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="formInline.create_date"
            type="date"
            placeholder="选择日期"
            prefix-icon="niubi"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="标题" class="title">
          <el-input v-model="formInline.title"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button @click="formInline = {}">清除</el-button>
          <el-button type="primary" @click="addFormVisible = true" icon="el-icon-plus">新增学科</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 内容 -->
    <el-card class="main-card">
      <!-- 表格 -->
      <el-table :data="tableData" style="width: 100%" stripe border>
        <el-table-column type="index" label="序号"></el-table-column>
        <!-- 默认数据的展示效果 不能满足自己的需求时 -->
        <el-table-column prop="title" label="题目">
          <template slot-scope="scope">
            <span v-html="scope.row.title"></span>
          </template>
        </el-table-column>
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
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button @click="showEdit(scope.row)" type="text">编辑</el-button>
            <el-button
              @click="status(scope.row)"
              type="text"
            >{{ scope.row.status === 1 ? "禁用" : "启用" }}</el-button>
            <el-button @click="remove(scope.row)" type="text">删除</el-button>
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
    <!-- 新增对话框 -->
    <el-dialog title="新增题库" :visible.sync="addFormVisible" fullscreen @opened="opened">
      <el-form :model="addForm" ref="addForm" :rules="addRules">
        <el-form-item label="学科" prop="subject">
          <el-select v-model="addForm.subject" placeholder="请选择学科">
            <el-option label="JavaScript" value="JavaScript"></el-option>
            <el-option label="前端" value="前端"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="阶段" prop="step">
          <el-select v-model="addForm.step" placeholder="请选择阶段">
            <el-option label="初级" value="初级"></el-option>
            <el-option label="中级" value="中级"></el-option>
            <el-option label="高级" value="高级"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业" prop="enterprise">
          <el-select v-model="addForm.enterprise" placeholder="请选择企业">
            <el-option label="黑马" value="黑马"></el-option>
            <el-option label="阿里" value="阿里"></el-option>
            <el-option label="京东" value="京东"></el-option>
          </el-select>
        </el-form-item>

        <!-- 级联选择器 -->
        <el-form-item label="城市" prop="city">
          <el-cascader
            size="large"
            :options="options"
            v-model="addForm.city"
            :props="{value:'label'}"
          ></el-cascader>
        </el-form-item>

        <el-form-item label="题型" prop="type">
          <el-radio v-model="addForm.type" label="1">单选</el-radio>
          <el-radio v-model="addForm.type" label="2">多选</el-radio>
          <el-radio v-model="addForm.type" label="3">简答</el-radio>
        </el-form-item>
        <el-form-item label="难度" prop="difficulty">
          <el-radio v-model="addForm.difficulty" label="1">简单</el-radio>
          <el-radio v-model="addForm.difficulty" label="2">一般</el-radio>
          <el-radio v-model="addForm.difficulty" label="3">困难</el-radio>
        </el-form-item>
        <el-form-item label="试题标题" prop="title"></el-form-item>
        <!-- 标题富文本  -->
        <el-form-item>
          <div id="editor" ref="editor"></div>
        </el-form-item>

        <!-- 选项区域 单选 -->
        <el-form-item label="单选" prop="radio">
          <el-radio-group v-model="addForm.single_select_answer">
            <div class="radio-box">
              <!-- :label = '1' 表示js代码去解析 -->
              <!-- label = '1' 表示 字符串去解析 -->
              <el-radio label="A">A</el-radio>
              <!-- 文本框 -->
              <el-input v-model="addForm.select_options[0].text" ></el-input>
              <!-- 上传 -->
              <el-upload
                class="avatar-uploader"
                :action="actions"
                :show-file-list="false"
                :on-success="aAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <el-button type="primary">上传缩略图</el-button>
                <img :src="aImageURL" class="avatar" />
              </el-upload>
            </div>
            <div class="radio-box">
              <!-- :label = '1' 表示js代码去解析 -->
              <!-- label = '1' 表示 字符串去解析 -->
              <el-radio label="B">B</el-radio>
              <!-- 文本框 -->
              <el-input v-model="addForm.select_options[1].text" ></el-input>
              <!-- 上传 -->
              <el-upload
                class="avatar-uploader"
                :action="actions"
                :show-file-list="false"
                :on-success="bAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <el-button type="primary">上传缩略图</el-button>
                <img :src="bImageURL" class="avatar" />
              </el-upload>
            </div>
            <div class="radio-box">
              <!-- :label = '1' 表示js代码去解析 -->
              <!-- label = '1' 表示 字符串去解析 -->
              <el-radio label="C">C</el-radio>
              <!-- 文本框 -->
              <el-input v-model="addForm.select_options[2].text" ></el-input>
              <!-- 上传 -->
              <el-upload
                class="avatar-uploader"
                :action="actions"
                :show-file-list="false"
                :on-success="cAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <el-button type="primary">上传缩略图</el-button>
                <img :src="cImageURL" class="avatar" />
              </el-upload>
            </div>
            <div class="radio-box">
              <el-radio label="D">D</el-radio>
              <!-- 文本框 -->
              <el-input v-model="addForm.select_options[3].text" ></el-input>
              <!-- 上传 -->
              <el-upload
                class="avatar-uploader"
                :action="actions"
                :show-file-list="false"
                :on-success="dAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <el-button type="primary">上传缩略图</el-button>
                <img :src="dImageURL" class="avatar" />
              </el-upload>
            </div>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="解析视频" class="video"></el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 导入 接口
import { questionList, subject, enterprise } from "../../../api/api.js";
// 导入 富文本编辑器
import wangEditor from "wangeditor";
// 导入数据 城市数据
import { regionData } from "element-china-area-data";
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
      total: 0,
      // 新增的表格数据
      addForm: {
        type: "单选",
        city: ["天津市", "市辖区"],
        title: "",
        answer_analyze: "",
        select_options: [
          {
            label: "A",
            text: "狗不理",
            image: "upload/20191129/fd5f03a07d95e3948860240564b180e4.jpeg"
          },
          {
            label: "B",
            text: "猫不理",
            image: "upload/20191129/e93e7bb72accda7f3159cdabc4203991.jpeg"
          },
          {
            label: "C",
            text: "麻花",
            image: "upload/20191129/b7caf98be9d0aa6764b0112ba0dfa19e.jpeg"
          },
          {
            label: "D",
            text: "炸酱面",
            image: "upload/20191129/4067f19ab53a5e8388ad3459e23110f0.jpeg"
          }
        ],
        subject: 11,
        step: "初级",
        enterprise: 15,
        difficulty: "简单",
        single_select_answer: "A",
        video: "upload/20191129/bd666ff11c11cc01f494d6ba49757a64.png",
        remark: "好好吃东西哦"
      },
      // 省市区数据
      options: regionData,
      // 新增表单是否显示
      addFormVisible: false,
      // label的宽度不设置不能都在一行
      formLabelWidth: "100px",
      // 新增表单验证规则
      addRules: {
        subject: [
          { required: true, message: "学科不能为空哦", trigger: "blur" }
        ],
        step: [{ required: true, message: "不能为空哦", trigger: "blur" }],
        enterprise: [
          { required: true, message: "企业不能为空哦", trigger: "blur" }
        ],
        city: [{ required: true, message: "城市不能为空哦", trigger: "blur" }],
        type: [{ required: true, trigger: "blur" }],
        difficulty: [{ required: true, trigger: "blur" }],
        answer_analyze: [{ required: true, trigger: "blur" }],
        title: [{ required: true, trigger: "blur" }],
        radio: [{ required: true, trigger: "blur" }]
      },
      // 标题富文本
      editor: undefined,

      radio: 1,
      // 学科列表
      subjectArr: [],
      // 企业列表
      enterpriseArr: [],
      // 上传地址
      actions: "http://127.0.0.1/heimamm/public/question/upload",
      // 选项A的图片地址 
      aImageURL: "",
      bImageURL: "",
      cImageURL: "",
      dImageURL: "",
    };
  },
  // 初始数据的获取
  created() {
    // 调用接口
    questionList.list({}).then(res => {
      // window.console.log(res);
      // 赋值给table
      this.tableData = res.data.data.items;
      // 保存 总条数
      this.total = res.data.data.pagination.total;
    });

    // 企业数据
    enterprise.list().then(res => {
      // window.console.log(res);
      this.enterpriseArr = res.data.data.items;
    });
    // 学科数据
    subject.list().then(res => {
      // window.console.log(res);
      this.subjectArr = res.data.data.items;
    });
  },
  // 富文本编辑器钩子

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
    },
    // 企业状态的启用禁用切换
    status(data) {
      // 接受传过来的一行数据
      questionList
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
    // 对话框打开方式
    opened() {
      if (this.editor == undefined) {
        //   vue里面推荐
        this.editor = new wangEditor(this.$refs.editor);
        this.editor.create();
      }
    },
    // 上传缩略图
    handleAvatarSuccess(res, file) {
      this.aImageURL = URL.createObjectURL(file.raw);
    },
    // 上传成功
    aAvatarSuccess(res, file) {
      // window.console.log(res);
      // window.console.log(file);
      // 保存图片地址到选项中
      this.addForm.select_options[0].image = res.data.url;
      this.aImageURL = URL.createObjectURL(file.raw);
    },
    bAvatarSuccess(res, file) {
      // window.console.log(res);
      // window.console.log(file);
      // 保存图片地址到选项中
      this.addForm.select_options[1].image = res.data.url;
      this.bImageURL = URL.createObjectURL(file.raw);
    },
    cAvatarSuccess(res, file) {
      // window.console.log(res);
      // window.console.log(file);
      // 保存图片地址到选项中
      this.addForm.select_options[2].image = res.data.url;
      this.cImageURL = URL.createObjectURL(file.raw);
    },
    dAvatarSuccess(res, file) {
      // window.console.log(res);
      // window.console.log(file);
      // 保存图片地址到选项中
      this.addForm.select_options[3].image = res.data.url;
      this.dImageURL = URL.createObjectURL(file.raw);
    },
    // 上传之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
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
      background: linear-gradient(to right, #01c5fa, #1394fa);

      .el-dialog__title {
        color: white;
      }
    }

    .el-dialog__body {
      display: flex;
      justify-content: center;
      .el-form {
        width: 832px;
        // background-color: #ccc;
        .vedio {
          .el-form-item__label {
            width: 100px;
          }
        }
        .el-form-item__content {
          .el-radio-group {
            .radio-box {
              width: 771px;
              display: flex;
              align-items: center;
              .el-input {
                width: 476px;
                margin-right: 21px;
              }
              .avatar-uploader {
                display: inline;
                .el-upload {
                  // width: 178px;
                  height: 178px;
                  display: flex;
                  align-items: center;
                  .el-button {
                    width: 100px;
                    height: 38px;
                  }
                  
                }
              }
            }
          }
        }
        .el-input__inner {
          width: 100%;
        }
        .el-select {
          width: 364px;
        }
      }
    }
    .dialog-footer {
      text-align: center;
    }
    
  }
}
</style>
