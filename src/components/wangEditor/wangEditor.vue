<template>
  <div>
    <div
      ref="editor"
      style="text-align:left"
    ></div>
  </div>
</template>

<script>
import WangEditor from "wangeditor";
export default {
  name: "editor",
  model: {
    prop: "editorContent",
    event: "change"
  },
  props: {
    editorContent: { required: true }
  },
  mounted() {
    /*实例化*/
    var editor = new WangEditor(this.$refs.editor);
    /*设置上传图片*/
    editor.customConfig.uploadImgServer = "/upload/image/";
    editor.customConfig.uploadFileName = "fileToUpload";
    editor.customConfig.uploadImgHooks = {
      customInsert: function(insertImg, result, editor) {
        var url = result.data;
        insertImg(url);
      }
    };
    /*绑定回馈事件*/
    editor.customConfig.onchange = html => {
      this.$emit("change", html);
    };
    /*创建编辑器*/
    editor.create();
    /*初始内容*/
    editor.txt.html(this.editorContent);
  }
};
</script>