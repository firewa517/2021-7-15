<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="#">角色管理</a>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加按钮 -->
    <div class="addMenu">
      <el-button @click="openDialog" size="small" type="primary" plain
        >添加</el-button
      >
    </div>
    <!-- 菜单数据渲染 -->
    <el-table :data="getStateRoleList" border style="width: 100%">
      <el-table-column prop="id" label="角色编号" width="80"></el-table-column>
      <el-table-column
        prop="rolename"
        label="角色名称"
        width="180"
      ></el-table-column>
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
      :title="isAdd ? '添加角色' : '编辑角色'"
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
        <el-form-item label="角色名称" prop="rolename">
          <el-input v-model="ruleForm.rolename"></el-input>
        </el-form-item>
        <el-form-item label="角色权限">
          <el-tree
            show-checkbox
            :data="getStateNavList"
            :props="defaultProps"
            default-expand-all
            :default-checked-keys="defaultKeys"
            node-key="id"
            ref="tree"
            check-strictly
          ></el-tree>
          <!-- node-key=什么值，this.$refs.tree.getCheckedKeys()获取的就是什么值，要加  ref="tree"-->
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
import { mapGetters } from "vuex";

import {
  getRoleedit,
  getRoleinfo,
  getRoledelete,
  getRoleadd,
} from "../../util/axios";
export default {
  data() {
    return {
      defaultKeys: [],
      editId: "",
      isAdd: true,
      dialogFormVisible: false,
      formLabelWidth: "120px",
      ruleForm: {
        rolename: "", //角色名称
        menus: "", //角色权限
        status: false, //状态1正常2禁用
      },
      rules: {
        rolename: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
      },
      defaultProps: {
        children: "children",
        label: "title",
      },
    };
  },
  mounted() {
    //页面一加载，就获取数据
    this.$store.dispatch("getRoleListAction");
  },
  computed: {
    ...mapGetters(["getStateRoleList"]),
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
      this.$refs.tree.setCheckedKeys([]);
      this.ruleForm = {
        rolename: "", //角色名称
        menus: "", //角色权限
        status: false, //状态1正常2禁用
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
          getRoledelete({ id })
            .then((res) => {
              console.log(res, "删除");
              if (res.data.code == 200) {
                this.$store.dispatch("getRoleListAction");
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
      this.isAdd = false;
      this.dialogFormVisible = true;
      getRoleinfo({ id })
        .then((res) => {
          console.log(res, "获取一条数据！！！");
          if (res.data.code == 200) {
            this.ruleForm = res.data.list;
            //status要转化成true或者false
            this.ruleForm.status = this.ruleForm.status == 1 ? true : false;
            //对menus进行转化
            this.defaultKeys = this.ruleForm.menus
              ? this.ruleForm.menus.split(",")
              : [];
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
          data.menus = this.$refs.tree.getCheckedKeys().join(",");
          //调取添加接口
          getRoleedit(data)
            .then((res) => {
              //当成功的时候，我们调取查询接口，关闭弹框并清空你的输入内容
              if (res.data.code == 200) {
                //关闭弹框
                this.dialogFormVisible = false;
                //清空输入框
                this.resetInfo();
                //调取查询接口
                this.$store.dispatch("getRoleListAction");
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
          data.menus = this.$refs.tree.getCheckedKeys().join(","); //后台要求数据是数组字符串，所以要求逗号隔开
          //调取添加接口
          getRoleadd(data)
            .then((res) => {
              console.log(res, "响应");
              //当成功的时候，我们调取查询接口，关闭弹框并清空你的输入内容
              if (res.data.code == 200) {
                //关闭弹框
                this.dialogFormVisible = false;
                //清空输入框
                this.resetInfo();
                //调取查询接口
                this.$store.dispatch("getRoleListAction");
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