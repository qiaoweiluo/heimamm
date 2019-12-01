<template>
  <div class="question-container">
    <!-- 头部 -->
    <el-card>
      <!-- 行内 表单 -->
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="学科" class="more-width">
          <!-- 表单元素数据的绑定 是v-model -->
          <el-select v-model="formInline.subject" placeholder="请选择学科">
            <el-option
              v-for="item in subjectArr"
              :label="item.name"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="阶段" class="more-width">
          <!-- 表单元素数据的绑定 是v-model -->
          <el-select v-model="formInline.step" placeholder="请选择阶段">
            <el-option label="初级" value="初级"></el-option>
            <el-option label="中级" value="中级"></el-option>
            <el-option label="高级" value="高级"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业" class="more-width">
          <!-- 表单元素数据的绑定 是v-model -->
          <el-select v-model="formInline.enterprise" placeholder="请选择企业">
            <el-option
              v-for="item in enterpriseArr"
              :label="item.name"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="题型" class="more-width">
          <!-- 表单元素数据的绑定 是v-model -->
          <el-select v-model="formInline.type" placeholder="请选择题型">
            <el-option label="单选" value="单选"></el-option>
            <el-option label="多选" value="多选"></el-option>
            <el-option label="简答" value="简答"></el-option>
          </el-select>
        </el-form-item>
        <br />
        <el-form-item label="难度" class="more-width">
          <!-- 表单元素数据的绑定 是v-model -->
          <el-select v-model="formInline.difficulty" placeholder="请选择难度">
            <el-option label="简单" value="简单"></el-option>
            <el-option label="一般" value="一般"></el-option>
            <el-option label="困难" value="困难"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="formInline.creater"></el-input>
        </el-form-item>
        <el-form-item label="状态" class="more-width">
          <!-- 表单元素数据的绑定 是v-model -->
          <el-select v-model="formInline.status" placeholder="请选择状态">
            <el-option label="启用" :value="1"></el-option>
            <el-option label="禁用" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期" class="more-width">
          <el-date-picker
            v-model="formInline.create_date"
            type="datetime"
            placeholder="选择日期时间"
            default-time="12:00:00"
            prefix-icon="niubi"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="标题">
          <el-input class="title-input" v-model="formInline.title"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button @click="formInline = {}">清除</el-button>
          <el-button
            type="primary"
            @click="addFormVisible = true"
            icon="el-icon-plus"
            v-power="['管理员']"
            >新增试题</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 内容 -->
    <el-card class="main-card">
      <!-- 表格 -->
      <el-table :data="tableData" style="width: 100%" stripe border>
        <el-table-column type="index" label="序号"> </el-table-column>
        <el-table-column label="题目">
          <template slot-scope="scope">
            <span v-html="scope.row.title"></span>
          </template>
        </el-table-column>
        <el-table-column label="学科.阶段">
          <template slot-scope="scope">
            {{ scope.row.subject_name + "·" + scope.row.step }}
          </template>
        </el-table-column>
        <el-table-column prop="type" label="题型"> </el-table-column>
        <el-table-column prop="enterprise_name" label="企业"> </el-table-column>
        <el-table-column prop="creater" label="创建者"> </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0" class="red">禁用</span>
            <span v-else>启用</span>
          </template>
        </el-table-column>
        <el-table-column prop="reads" label="访问量"> </el-table-column>
        <el-table-column label="操作">
          <!-- 插槽 -->
          <template slot-scope="scope">
            <el-button @click="showEdit(scope.row)" type="text">编辑</el-button>
            <el-button @click="status(scope.row)" type="text">
              {{ scope.row.status === 1 ? "禁用" : "启用" }}
            </el-button>
            <el-button
              v-power="['管理员']"
              @click="remove(scope.row)"
              type="text"
              >删除</el-button
            >
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
      >
      </el-pagination>
    </el-card>

    <!-- 新增对话框 -->
    <el-dialog
      class="add-dialog"
      title="新增试题"
      fullscreen=""
      :visible.sync="addFormVisible"
      @opened="opened"
    >
      <el-form :model="addForm" ref="addForm" :rules="addFormRules">
        <!-- 学科 -->
        <el-form-item label="学科" class="more-width">
          <!-- 表单元素数据的绑定 是v-model -->
          <el-select v-model="addForm.subject" placeholder="请选择学科">
            <el-option
              v-for="item in subjectArr"
              :label="item.name"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 阶段 -->

        <el-form-item label="阶段" class="more-width">
          <!-- 表单元素数据的绑定 是v-model -->
          <el-select v-model="addForm.step" placeholder="请选择阶段">
            <el-option label="初级" value="初级"></el-option>
            <el-option label="中级" value="中级"></el-option>
            <el-option label="高级" value="高级"></el-option>
          </el-select>
        </el-form-item>
        <!-- 企业 -->
        <el-form-item label="企业" class="more-width">
          <!-- 表单元素数据的绑定 是v-model -->
          <el-select v-model="addForm.enterprise" placeholder="请选择企业">
            <el-option
              v-for="item in enterpriseArr"
              :label="item.name"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 城市 -->
        <el-form-item label="城市" class="more-width">
          <el-cascader
            size="large"
            :options="options"
            v-model="addForm.city"
            :props="{ value: 'label' }"
          >
          </el-cascader>
        </el-form-item>
        <!-- 题型 -->
        <el-form-item label="题型" class="more-width">
          <el-radio-group v-model="addForm.type">
            <el-radio label="单选">单选</el-radio>
            <el-radio label="多选">多选</el-radio>
            <el-radio label="简答">简答</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 难度 -->
        <el-form-item label="难度" class="more-width">
          <el-radio-group v-model="addForm.difficulty">
            <el-radio label="简单">简单</el-radio>
            <el-radio label="一般">一般</el-radio>
            <el-radio label="困难">困难</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 标题富文本 -->
        <el-form-item label="试题标题" prop="title"></el-form-item>
        <div ref="titleEditor"></div>
        <!-- 选项区域 单选 -->
        <el-form-item
          v-if="addForm.type === '单选'"
          label="单选"
          class="more-width"
        >
          <el-radio-group v-model="addForm.single_select_answer">
            <div class="select-box">
              <el-radio label="A">A</el-radio>
              <!-- 文本框 -->
              <el-input
                v-model="addForm.select_options[0].text"
                placeholder=""
              ></el-input>
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
            <div class="select-box">
              <el-radio label="B">B</el-radio>
              <!-- 文本框 -->
              <el-input
                v-model="addForm.select_options[1].text"
                placeholder=""
              ></el-input>
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
            <div class="select-box">
              <el-radio label="C">C</el-radio>
              <!-- 文本框 -->
              <el-input
                v-model="addForm.select_options[2].text"
                placeholder=""
              ></el-input>
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
            <div class="select-box">
              <el-radio label="D">D</el-radio>
              <!-- 文本框 -->
              <el-input
                v-model="addForm.select_options[3].text"
                placeholder=""
              ></el-input>
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
        <!-- 选项区域 多选 -->
        <el-form-item
          v-if="addForm.type === '多选'"
          label="多选"
          class="more-width"
        >
          <el-checkbox-group v-model="addForm.multiple_select_answer">
            <div class="select-box">
              <el-checkbox label="A">A</el-checkbox>
              <!-- 文本框 -->
              <el-input
                v-model="addForm.select_options[0].text"
                placeholder=""
              ></el-input>
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
            <div class="select-box">
              <el-checkbox label="B">B</el-checkbox>
              <!-- 文本框 -->
              <el-input
                v-model="addForm.select_options[1].text"
                placeholder=""
              ></el-input>
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
            <div class="select-box">
              <el-checkbox label="C">C</el-checkbox>
              <!-- 文本框 -->
              <el-input
                v-model="addForm.select_options[2].text"
                placeholder=""
              ></el-input>
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
            <div class="select-box">
              <el-checkbox label="D">D</el-checkbox>
              <!-- 文本框 -->
              <el-input
                v-model="addForm.select_options[3].text"
                placeholder=""
              ></el-input>
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
          </el-checkbox-group>
        </el-form-item>
        <!-- 视频上传区域 -->
        <el-form-item>
          <el-upload
            class="upload-demo"
            :action="actions"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-upload="beforeVideoUpload"
            :on-success="videoSuccess"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传视频
            </div>
          </el-upload>
        </el-form-item>

        <!-- 答案富文本 -->
        <el-form-item label="试题答案" prop="answer_analyze"></el-form-item>
        <div ref="answerEditor"></div>

        <!-- 备注 -->
        <el-form-item label="试题备注">
          <el-input
            v-model="addForm.remark"
            type="textarea"
            rows="2"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAdd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 导入接口
import { questionList, subject, enterprise } from "../../../api/api.js";
// 导入数据 城市数据
import { regionData } from "element-china-area-data";
// 导入 富文本
import WangEditor from "wangeditor";
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
      pageSizes: [5, 10, 15, 20],
      // 总条数
      total: 0,
      // 学科列表
      subjectArr: [],
      // 企业列表
      enterpriseArr: [],
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
        remark: "好好吃东西哦",
        // 多选选项
        multiple_select_answer: []
      },
      // 新增框是否显示
      addFormVisible: false,
      // 省市区数据
      options: regionData,
      // 标题富文本
      titleEditor: undefined,
      // 答案富文本
      answerEditor: undefined,
      // 新增表单验证规则
      addFormRules: {
        title: [{ required: true, message: "标题不能为空哦！" }],
        answer_analyze: [{ required: true, message: "答案解析不能为空哦" }]
      },
      // 上传地址
      actions: process.env.VUE_APP_BASEURL + "/question/upload",
      // 选项A的图片地址
      aImageURL: "",
      bImageURL: "",
      cImageURL: "",
      dImageURL: ""
    };
  },
  created() {
    // 初始数据获取
    questionList
      .list({
        page: this.page,
        limit: this.limit
      })
      .then(res => {
        // window.console.log(res)
        // 保存到table中
        this.tableData = res.data.data.items;
        // 总条数
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
  // 方法
  methods: {
    // 获取数据的逻辑
    getList() {
      window.console.log("getList");
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
    // 对话框打开的方法
    opened() {
      // 非空判断 标题富文本
      if (!this.titleEditor) {
        this.titleEditor = new WangEditor(this.$refs.titleEditor);
        // 调整设置
        this.titleEditor.customConfig.onchange = html => {
          // html 即变化之后的内容
          // window.console.log(html);
          // 设置给标题
          this.addForm.title = html;
        };
        // 创建
        this.titleEditor.create();
      }
      // 非空判断 标题富文本
      if (!this.answerEditor) {
        this.answerEditor = new WangEditor(this.$refs.answerEditor);
        // 调整设置
        this.answerEditor.customConfig.onchange = html => {
          // html 即变化之后的内容
          // window.console.log(html);
          // 设置给标题
          this.addForm.answer_analyze = html;
        };
        // 创建
        this.answerEditor.create();
      }
    },
    // 提交数据
    submitAdd() {
      this.$confirm("你即将要往服务器加一道题了哦", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 验证
          this.$refs.addForm.validate(valid => {
            if (valid) {
              // 提交
              questionList.add(this.addForm).then(res => {
                // window.console.log(res);
                if (res.data.code === 200) {
                  // 关闭对话框
                  this.addFormVisible = false;
                  // 清空数据
                  // this.$refs.addForm.resetFields();
                  for (const key in this.addForm) {
                    //  this.addForm[key]
                    if (key === "city") {
                      this.addForm[key] = [];
                    } else if (key === "multiple_select_answer") {
                      this.addForm[key] = [];
                    } else if (key === "select_options") {
                      this.addForm[key] = [
                        {
                          label: "A",
                          text: "",
                          image: ""
                        },
                        {
                          label: "B",
                          text: "",
                          image: ""
                        },
                        {
                          label: "C",
                          text: "",
                          image: ""
                        },
                        {
                          label: "D",
                          text: "",
                          image: ""
                        }
                      ];
                    }else{
                      this.addForm[key]=''
                    }
                  }
                  // 重新获取数据
                  this.getList();
                }
              });
            } else {
              this.$message.warning("表单验证失败");
              return false;
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消提交"
          });
        });
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
    },
    // 视频上传之前
    beforeVideoUpload(file) {
      window.console.log(file);
      const isJPG = file.type === "video/mp4";
      const isLt2M = file.size / 1024 / 1024 < 8;

      if (!isJPG) {
        this.$message.error("上传视频只能是 MP4 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传视频大小不能超过 8MB!");
      }
      return isJPG && isLt2M;
    },
    // 视频上传成功
    videoSuccess(res) {
      // window.console.log(res);
      // 保存视频地址
      this.addForm.video = res.data.url;
    },
    // 预览的逻辑
    handleRemove(file, fileList) {
      window.console.log(file, fileList);
    },
    handlePreview(file) {
      window.console.log(file);
    }
  }
};
</script>

<style lang="less">
.question-container {
  .el-input__inner {
    width: 150px;
  }
  // 标题内部 文本框的尺寸
  .title-input {
    .el-input__inner {
      width: 400px;
    }
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

  // 文本的间隙
  .el-form-item__label {
    padding-right: 31px;
    padding-left: 30px;
  }

  // 新增 盒子
  .add-dialog {
    .el-form {
      width: 50%;
      margin: 0 auto;
      .el-input__inner {
        width: 364px;
      }
    }
    .el-dialog__footer {
      text-align: center;
    }

    // 选项布局
    .select-box {
      display: flex;
      align-items: center;
      height: 178px;
      .el-upload {
        display: flex;
        height: 178px;
        align-items: center;
      }
      .el-button {
        height: 40px;
      }
    }

    .el-form-item__content {
      margin-top: 30px;
    }
  }
}
</style>
