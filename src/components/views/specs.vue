<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="#">商品规格管理</a>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加按钮 -->
    <div class="addMenu">
      <el-button @click="openDialog" size="small" type="primary" plain
        >添加</el-button
      >
    </div>
    <!-- 菜单数据渲染 -->
    <el-table :data="getStateSpecsList" border style="width: 100%">
      <el-table-column prop="id" label="规格编号"></el-table-column>
      <el-table-column
        prop="specsname"
        label="规格名称"
        width="180"
      ></el-table-column>
      <el-table-column label="规格属性">
       <template slot-scope="item">
          <el-tag v-for="item in item.row.attrs" type="info" :key="item">{{item}}</el-tag>
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
    <!-- 
      分页器 
      background 背景色
      total 总条目数
      layout 组件布局 子组件名用逗号分隔
      page-size 每页显示条目个数，支持 .sync 修饰符
      current-change currentPage 改变时会触发回调函数（当前页）
      current-change事件来处理页码大小和当前页变动时候触发的事件。
    -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      @current-change="getPage"
    >
    </el-pagination>
    <!-- 对话框 -->
    <el-dialog
      :title="isAdd ? '添加商品规格' : '编辑商品规格'"
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
        <el-form-item label="规格名称" prop="specsname">
          <el-input v-model="ruleForm.specsname"></el-input>
        </el-form-item>
        <!-- 规格属性
        颜色  红色 白色
        尺寸  大 中 小
        分期  3个月  6个月  12个月-->
        <el-form-item
          v-for="(d, index) in specsArr"
          :label="'规格属性'"
          :key="index"
        >
          <el-input style="width: 70%" v-model="d.value"></el-input>
          <el-button v-if="index == 0" type="primary" @click="addSpecsArr"
            >新增规格属性</el-button
          >
          <el-button v-else @click.prevent="removeArr(d)">删除</el-button>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="ruleForm.status"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="beforeClose">取 消</el-button>
        <el-button type="primary" @click="addData('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import {
  getSpecsadd,
  getSpecsinfo,
  getSpecsedit,
  getSpecsdelete,
  getSpecscount,
} from "../../util/axios";
export default {
  data() {
    return {
      editId: "",
      isAdd: true,
      dialogFormVisible: false,
      formLabelWidth: "120px",
      ruleForm: {
        specsname: "", //管理员名称
        attrs: "", //密码
        status: false, //状态1正常2禁用
      },
      specsArr: [
        {
          value: "",
        },
      ],
      rules: {
        specsname: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
        ],
      },
      pageSize: 2,
      pageNum: 1,
      total: 0,
    };
  },
  mounted() {
    //页面一加载，就获取数据
    //管理员列表有必传参数，参数内容是分页页面与条数
    this.getCount();
  },
  computed: {
    ...mapGetters(["getStateSpecsList"]),
  },
  methods: {
    addSpecsArr() {
       if (this.specsArr.length <= 5) {
        this.specsArr.push({
          value: ""
        });
      }
    },
    removeArr(d) {
      var index = this.specsArr.indexOf(d);
      if (index !== -1) {
        this.specsArr.splice(index, 1);
      }
    },
    //获取管理员数据的总条目
    getCount() {
      getSpecscount()
        .then((res) => {
          //console.log(res,"条目")
          if (res.data.code == 200) {
            this.total = res.data.list[0].total;
            if (this.total <= this.pageSize) {
              this.pageNum = 1;
            }
            this.$store.dispatch("getSpecsListAction", {
              size: this.pageSize,
              page: this.pageNum,
            });
          }
        })
        .catch((err) => {
          console.log(err, "捕获错误");
        });
    },
    //获取当前页
    getPage(n) {
      console.log(n, "当前页");
      this.pageNum = n;
      //当我的分页页码有变化的时候，我们要重新获取数据列表
      //调取查询接口
      this.$store.dispatch("getSpecsListAction", {
        size: this.pageSize,
        page: this.pageNum,
      });
    },
    //关闭之前执行的方法
    beforeClose() {
      this.dialogFormVisible = false;
      this.resetInfo();
    },
    //清空表单输入框
    resetInfo() {
      this.ruleForm = {
       specsname: "", //商品规格名称
        attrs: "", //商品规格属性值
        status: false //状态1正常2禁用
      };
      this.specsArr = [
        {
          value: ""
        }
      ];
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
        type: "warning"
      })
        .then(() => {
          //调取删除接口
          getSpecsdelete({ id })
            .then(res => {
              console.log(res, "删除");
              if (res.data.code == 200) {
                //调取查询接口
                this.getCount();
                this.$message.success(res.data.msg);
              } else {
                this.$message.error(res.data.msg);
              }
            })
            .catch(err => {
              console.log(err, "捕获错误");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //表格的编辑更新事件
    update(id) {
      this.editId = id;
      this.isAdd = false;
      this.dialogFormVisible = true;
      getSpecsinfo({ id })
        .then((res) => {
          console.log(res, "specs获取一条数据！！！");
          if (res.data.code == 200) {
            this.ruleForm = res.data.list[0];
            //status要转化成true或者false
            this.ruleForm.status = this.ruleForm.status == 1 ? true : false;
            //对menus进行转化
             //对attrs转化
            this.ruleForm.attrs.map((item, i) => {
              if (i == 0) {
                this.specsArr[0].value = item;
              } else {
                this.specsArr.push({
                  value: item
                });
              }
            });
            this.$message.success(res.data.msg);
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch((err) => {
          console.log(err, "捕获错误");
        });
    },
    //添加数据的事件
    addData(ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          //添加之前要对入参进行类型转化
          let data = this.ruleForm;
          data.status = data.status ? "1" : "2";
          //商品规格属性值 转化 attrs
          let arr = [];
          //对specsArr 循环遍历 得到value
          this.specsArr.map((d, i) => {
            arr.push(d.value);
          });
          data.attrs = arr ? arr.join(",") : "";
          if (this.isAdd) {
            getSpecsadd(data)
              .then((res) => {
                console.log(res, "响应");
                //当成功的时候，我们调取查询接口，关闭弹框并清空你的输入内容
                if (res.data.code == 200) {
                  //关闭弹框
                  this.dialogFormVisible = false;
                  //清空输入框
                  this.resetInfo();
                  //调取查询接口
                  this.$store.dispatch("getSpecsListAction", {
                    size: this.pageSize,
                    page: this.pageNum,
                  });
                  this.getCount();
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
            data.id = this.editId;
            //调取添加接口
            getSpecsedit(data)
              .then((res) => {
                //当成功的时候，我们调取查询接口，关闭弹框并清空你的输入内容
                if (res.data.code == 200) {
                  //关闭弹框
                  this.dialogFormVisible = false;
                  //清空输入框
                  this.resetInfo();
                  //调取查询接口
                  this.getCount();
                  //提示文案
                  this.$message.success(res.data.msg);
                } else {
                  this.$message.error(res.data.msg);
                }
              })
              .catch((err) => {
                console.log(err, "cuowu");
              });
          }
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
.el-pagination {
  float: right;
  margin: 10px 5px;
}
</style>