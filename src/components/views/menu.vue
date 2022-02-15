<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="#">菜单管理</a>
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
      :data="getStateNavList"
      border
      style="width: 100%"
      row-key="id"
      :tree-props="{ children: 'children' }"
    >
      <el-table-column prop="id" label="菜单编号" width="80"></el-table-column>
      <el-table-column
        prop="title"
        label="菜单名称"
        width="180"
      ></el-table-column>
      <el-table-column prop="pid" label="上级菜单" width="80"></el-table-column>
      <!-- <el-table-column
        prop="type"
        label="菜单类型"
        width="180"
      ></el-table-column> -->
      <el-table-column label="菜单图标" width="180">
        <template slot-scope="item">
          <i :class="item.row.icon"></i>
        </template>
      </el-table-column>
      <el-table-column prop="url" label="菜单地址"></el-table-column>
      <el-table-column label="状态" width="80">
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
      :title="isAdd ? '添加菜单' : '编辑菜单'"
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
        <el-form-item label="菜单名称" prop="title">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单" prop="pid">
          <el-select v-model="ruleForm.pid" placeholder="请选择上级菜单">
            <el-option label="顶级菜单" :value="0"></el-option>
            <el-option
              v-for="option in getStateNavList"
              :label="option.title"
              :key="option.id"
              :value="option.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单类型" prop="icon">
          <el-radio v-model="ruleForm.type" label="1">目录</el-radio>
          <el-radio v-model="ruleForm.type" label="2">菜单</el-radio>
        </el-form-item>
        <el-form-item v-show="ruleForm.type == 1" label="菜单图标" prop="icon">
          <el-input v-model="ruleForm.icon"></el-input>
        </el-form-item>
        <el-form-item v-show="ruleForm.type == 2" label="菜单地址" prop="url">
          <el-input v-model="ruleForm.url"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="ruleForm.status"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="beforeClose">取 消</el-button>
        <el-button type="primary" v-if="isAdd" @click="addData('ruleForm')"
          >确 定</el-button
        >
        <el-button v-else type="primary" @click="editData('ruleForm')"
          >修改</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {getMenuAdd,getMenuinfo,getMenuedit,getMenudelete} from '../../util/axios'
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      editId: "",
      isAdd: true,
      dialogFormVisible: false,
      formLabelWidth: "120px",
      ruleForm: {
        title: "", //标题
        pid: "", //上级分类编号 0 1
        icon: "", //图标
        url: "", //菜单地址
        status: false, //状态1正常2禁用
        type: "1", //1是目录2是菜单
        id: "",
      },
      rules: {
        title: [
          { required: true, message: "请输入菜单名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
       pid: [{ required: true, message: "请选择上级菜单", trigger: "blur" }],
      }, 
    };
  },
  mounted() {
    //页面一加载，就获取数据
    this.$store.dispatch("getNavListAction");
  },
  computed: {
    ...mapGetters(["getStateNavList"]),
  },
  methods: {
    //关闭之前执行的方法
    beforeClose() {
      this.dialogFormVisible = false;
      this.resetInfo();
    },
    //清空表单输入框
    resetInfo() {
      this.ruleForm = {
        title: "", //标题
        pid: "", //上级分类编号 0 1
        icon: "", //图标
        url: "", //菜单地址
        status: false, //状态1正常2禁用
        type: "1", //1是目录2是菜单
        id: "",
      };
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
          getMenudelete({id})
            .then((res) => {
              //console.log(res, "删除");
              if (res.data.code == 200) {
                this.$store.dispatch("getNavListAction");
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
      console.log("触发编辑事件");
      this.isAdd = false;
      this.dialogFormVisible = true;
      getMenuinfo({id})
        .then((res) => {
          //console.log(res, "获取一条数据！！！");
          if (res.data.code == 200) {
            this.ruleForm = res.data.list;
            //对类型进行转换
            this.ruleForm.type = this.ruleForm.type.toString();
            //status要转化成true或者false
            this.ruleForm.status = this.ruleForm.status == 1 ? true : false;
            this.$message.success(res.data.msg);
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch((err) => {
          console.log(err, "捕获错误");
        });
    },
    editData(ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          //添加之前 要对入参进行类型转化
          let data = this.ruleForm;
          data.status = data.status ? "1" : "2";
          data.id = this.editId;
          //调取添加接口
          getMenuedit(data)
            .then((res) => {
              //当成功的时候，我们调取查询接口，关闭弹框并清空你的输入内容
              if (res.data.code == 200) {
                //关闭弹框
                this.dialogFormVisible = false;
                //清空输入框
                this.resetInfo();
                //调取查询接口
                this.$store.dispatch("getNavListAction");
                //提示文案
                this.$message.success(res.data.msg);
              } else {
                this.$message.error(res.data.msg);
              }
            })
            .catch((err) => {
              console.log(err, "cuowu");
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //添加数据的事件
    addData(ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          //添加之前要对入参进行类型转化
          let data = this.ruleForm;
          data.status = data.status ? "1" : "2";
          //调取添加接口
          getMenuAdd(data)
            .then((res) => {
              //console.log(res, "响应");
              //当成功的时候，我们调取查询接口，关闭弹框并清空你的输入内容
              if (res.data.code == 200) {
                //关闭弹框
                this.dialogFormVisible = false;
                //清空输入框
                this.resetInfo();
                //调取查询接口
                this.$store.dispatch("getNavListAction");
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
            .catch((err) => {
              console.log(err, "cw");
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
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