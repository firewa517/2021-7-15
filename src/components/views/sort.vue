<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="#">商品分类</a>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加按钮 -->
    <div class="addMenu">
      <el-button @click="openDialog" size="small" type="primary" plain
        >添加</el-button
      >
    </div>
    <!-- 菜单数据渲染 -->
    <el-table
      :data="getStateCateList"
      border
      style="width: 100%"
      row-key="id"
      :tree-props="{ children: 'children' }"
    >
      <el-table-column prop="id" label="分类编号" width="80"></el-table-column>
      <el-table-column
        prop="catename"
        label="分类名称"
        width="180"
      ></el-table-column>
      <el-table-column  label="图片" width="180">
         <template slot-scope="item">
         <img style="width:100px;" :src="'http://localhost:3000'+item.row.img" alt />
      </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="item">
          <el-tag v-if="item.row.status == 1" type="success">启用</el-tag>
          <el-tag v-else type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="item">
          <el-button @click="update(item.row.id)" type="primary" size="small"
            >编辑</el-button
          >
          <el-button @click="del(item.row.id)" type="danger" size="small"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 对话框 -->
    <el-dialog
      :title="isAdd ? '添加商品分类' : '编辑商品分类'"
      center
      :visible.sync="dialogFormVisible"
      :before-close="beforeClose"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="上级分类" prop="pid">
          <el-select v-model="ruleForm.pid" placeholder="请选择上级菜单">
            <el-option label="顶级分类" :value="0"></el-option>
            <el-option
              v-for="option in getStateCateList"
              :label="option.catename"
              :key="option.id"
              :value="option.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类名称" prop="catename">
          <el-input v-model="ruleForm.catename"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="img">
          <!-- 
            图片上传的视图 
            action 必选参数，上传的地址
            list-type 文件列表的类型
            auto-upload 是否在选取文件后立即进行上传
            on-preview 点击文件列表中已上传的文件时的钩子（预览的回调函数）
            on-remove 文件列表移除文件时的钩子
           on-change 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
           file-list 上传的文件列表, 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
          -->
          <el-upload
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            :on-change="handleChange"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="ruleForm.status"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="beforeClose">取 消</el-button>
        <el-button type="primary" @click="addData('ruleForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!-- 图片上传 -->
  </div>
</template>
<script>
import {
  getCateadd,
  getCateinfo,
  getCateedit,
  getCatedelete,
} from "../../util/axios";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      fileList:[],
      img:'',//图片对象
      dialogImageUrl: "", //图片预览
      dialogVisible: false, //看至图片窗口隐藏显示
      disabled: false, //禁止
      editId: "",
      isAdd: true, //是否是添加 true就是添加 false就是编辑
      dialogFormVisible: false,
      formLabelWidth: "120px",

      ruleForm: {
        catename: "", //商品分类名称
        pid: "", //上级分类编号
        img: "", //图片(文件，一般用于二级分类)
        status: false, //状态1正常2禁用
      },
      rules: {
        catename: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          {
            min: 1,
            max: 20,
            message: "长度在 1 到 20 个字符",
            trigger: "blur",
          },
        ],
        pid: [{ required: true, message: "请选择上级菜单", trigger: "blur" }],
      },
    };
  },
  mounted() {
    //页面一加载，就获取数据
    this.$store.dispatch("getCateListAction");
  },
  computed: {
    ...mapGetters(["getStateCateList"]),
  },
  methods: {
    //图片删除方法
    handleRemove(file) {
      console.log(file);
    },
    //预览图片的方法
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //通过 on-change 钩子函数来对列表进行控制
    handleChange(file, fileList) {
      this.img = file.raw;
    },
    //关闭之前执行的方法
    beforeClose() {
      this.dialogFormVisible = false;
      this.resetInfo();
    },
    //清空表单输入框
    resetInfo() {
      this.ruleForm = {
        catename: "", //标题
        pid: "", //上级分类编号 0 1
        img: "", //图标
        status: false, //状态1正常2禁用
      };
      this.img = "";
      this.fileList = [];
    },
    //打开添加弹框事件
    openDialog() {
      this.isAdd = true;
      this.dialogFormVisible = true;
    },
    //表格删除事件
    del(id) {
      //点击删除事件出现提示框
      this.$confirm("你确定要删除该条数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //调取删除接口
          getCatedelete({ id })
            .then((res) => {
              //console.log(res, "删除");
              if (res.data.code == 200) {
                this.$store.dispatch("getCateListAction");
                this.$message.success(res.data.msg);
              } else {
                this.$message.error(res.data.msg);
              }
            })
            .catch((err) => {
              console.log(err, "捕获错误");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //表格的编辑更新事件
    update(id) {
      this.editId = id;
      //console.log("触发编辑事件");
      this.isAdd = false;
      this.dialogFormVisible = true;
      getCateinfo({ id })
        .then((res) => {
          console.log(res, "sort获取一条数据！！！");
          if (res.data.code == 200) {
            this.ruleForm = res.data.list;
            //status要转化成true或者false
            this.ruleForm.status = this.ruleForm.status == 1 ? true : false;
              this.fileList = this.ruleForm.img ? [{ url: "http://localhost:3000" + this.ruleForm.img }]: [];
            this.$message.success(res.data.msg);
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch((err) => {
          console.log(err, "捕获错误");
        });
    },
    addData(ruleForm) {
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          //添加之前 要对入参进行类型转化
          let data = this.ruleForm;
          data.status = data.status ? "1" : "2";
          //针对于文件上传内容进行转化
          let file = new FormData();
          for (let i in data) {
            file.append(i, data[i]);
          }
          file.append("img", this.img);
          if (this.isAdd) {
            //调取添加接口
            getCateadd(file)
              .then(res => {
                //当成功的时候，我们调取查询接口，关闭弹框并清空你的输入内容
                if (res.data.code == 200) {
                  //关闭弹框
                  this.dialogFormVisible = false;
                  //清空输入框
                  this.resetInfo();
                  //调取查询接口
                  this.$store.dispatch("getCateListAction");
                  //提示文案
                  this.$message.success(res.data.msg);
                } else if (res.data.code == 500) {
                  //当名称重复的时候，可以重新修改
                  //配合名称重复的时候，页面其他状态不变
                  this.ruleForm.status = data.status == "1" ? true : false;
                  this.$message.warning(res.data.msg);
                } else {
                  this.$message.error(res.data.msg);
                }
              })
              .catch(err => {
                console.log(err, "cuowu");
              });
          } else {
            //修改的时候 要带着id
            file.append("id", this.editId);
            //调取修改接口
            getCateedit(file)
              .then(res => {
                //当成功的时候，我们调取查询接口，关闭弹框并清空你的输入内容
                if (res.data.code == 200) {
                  //关闭弹框
                  this.dialogFormVisible = false;
                  //清空输入框
                  this.resetInfo();
                  //调取查询接口
                  this.$store.dispatch("getCateListAction");
                  //提示文案
                  this.$message.success(res.data.msg);
                } else {
                  this.$message.error(res.data.msg);
                }
              })
              .catch(err => {
                console.log(err, "cuowu");
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
};
</script>
<style lang="" scoped>
.el-breadcrumb {
  height: 40px;
}
.addMenu {
  margin: 5px 0;
}
</style>