<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="#">商品管理</a>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加按钮 -->
    <div class="addMenu">
      <el-button @click="openDialog" size="small" type="primary" plain
        >添加</el-button
      >
    </div>
    <!-- 菜单数据渲染 -->
    <el-table :data="getStateGoodsList" border style="width: 100%">
      <el-table-column prop="id" label="商品编号"></el-table-column>
      <el-table-column prop="goodsname" label="商品名称"></el-table-column>
      <el-table-column prop="price" label="商品价格"></el-table-column>
      <el-table-column prop="market_price" label="市场价格"></el-table-column>
      <el-table-column prop="img" label="图片">
        <template slot-scope="item">
          <img style="width:100px;" :src="'http://localhost:3000'+item.row.img" alt />
        </template>
      </el-table-column>
      <el-table-column label="状态" width="60">
        <template slot-scope="item">
          <el-tag v-if="item.row.status == 1" type="success">启用</el-tag>
          <el-tag v-else type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否新品" width="60">
        <template slot-scope="item">
          <el-tag v-if="item.row.isnew == 1" type="success">是</el-tag>
          <el-tag v-else type="danger">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否热卖" width="60">
        <template slot-scope="item">
          <el-tag v-if="item.row.ishot == 1" type="success">是</el-tag>
          <el-tag v-else type="danger">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作"  width="180">
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
      :title="isAdd ? '添加商品' : '编辑商品'"
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
        <el-form-item label="一级分类" prop="first_cateid">
          <el-select @change="cateChange" v-model="ruleForm.first_cateid" placeholder="请选择">
            <el-option
              v-for="option in cateArr"
              :label="option.catename"
              :key="option.id"
              :value="option.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类" prop="second_cateid">
          <el-select v-model="ruleForm.second_cateid" placeholder="请选择">
            <el-option
              v-for="option in secondArr"
              :label="option.catename"
              :key="option.id"
              :value="option.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称" prop="goodsname" >
          <el-input v-model="ruleForm.goodsname"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="ruleForm.price" type="number"></el-input>
        </el-form-item>
        <el-form-item label="市场价格" prop="market_price">
          <el-input v-model="ruleForm.market_price" type="number"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="img">
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
        <el-form-item label="商品规格" prop="specsid">
          <el-select @change="specsChange" v-model="ruleForm.specsid" placeholder="请选择">
            <el-option
              v-for="option in specsArr"
              :label="option.specsname"
              :key="option.id"
              :value="option.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="规格属性" prop="specsattr" >
          <el-select v-model="ruleForm.specsattr" placeholder="请选择" multiple>
            <el-option
              v-for="(option,i) in specsAttrs"
              :label="option"
              :key="i"
              :value="i+''"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否新品">
          <template>
            <el-radio v-model="ruleForm.isnew" label="1">是</el-radio>
            <el-radio v-model="ruleForm.isnew" label="2">否</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="是否热卖">
          <template>
            <el-radio v-model="ruleForm.ishot" label="1">是</el-radio>
            <el-radio v-model="ruleForm.ishot" label="2">否</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="ruleForm.status"></el-switch>
        </el-form-item>
        <el-form-item label="商品描述">
          <div ref="editorInfo" id="wangEditor"></div>
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
import E from "wangeditor";
import { mapGetters } from "vuex";
import {
  getGoodsadd,
  getGoodsinfo,
  getGoodsdelete,
  getGoodsedit,
  getGoodscount,
  getCatelist,
  getSpecsinfo,
  getSpecslist
} from "../../util/axios";
export default {
  data() {
    return {
      fileList: [],
      img: "", //图片对象
      dialogImageUrl: "", //图片预览
      dialogVisible: false, //看至图片窗口隐藏显示
      editId: "",
      isAdd: true,
      dialogFormVisible: false,
      formLabelWidth: "120px",
      ruleForm: {
       first_cateid: "", //一级分类编号
        second_cateid: "", //二级分类编号
        goodsname: "", //商品名称
        price: "", //商品价格
        market_price: "", //市场价格
        img: "", //商品图片（文件）
        description: "", //商品描述
        specsid: "", //商品规格编号
        specsattr: "", //商品规格属性
        isnew: "1", //是否新品 1是2不是
        ishot: "1", //是否热卖推荐1是2不是
        status: false //状态1正常2禁用
      },
      rules: {
         goodsname: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        first_cateid: [
          { required: true, message: "请选择一级分类", trigger: "blur" }
        ],
        second_cateid: [
          { required: true, message: "请选择二级分类", trigger: "blur" }
        ],
        price: [{ required: true, message: "请输入价格", trigger: "blur" }],
        market_price: [
          { required: true, message: "请输入市场价格", trigger: "blur" }
        ],
        specsid: [
          { required: true, message: "请选择商品规格分类", trigger: "blur" }
        ],
        specsattr: [
          { required: true, message: "请选择规格属性分类", trigger: "blur" }
        ]
      },
      pageSize: 2,
      pageNum: 1,
      total: 0,
      editor: null,
      cateArr: [], //商品分类一级
      secondArr: [], //商品分类二级
      specsArr: [], //商品规格
      specsAttrs: [] //规格属性
    };
  },
  mounted() {
    //页面一加载，就获取数据
    getCatelist({ pid: 0 })
      .then(res => {
        if (res.data.code == 200) {
          this.cateArr = res.data.list;
        }
      })
      .catch(err => {
        console.log(err, "错误捕获");
      });
    //页面一加载，就获取商品规格列表数据
    getSpecslist()
      .then(res => {
        if (res.data.code == 200) {
          this.specsArr = res.data.list;
        }
      })
      .catch(err => {
        console.log(err, "错误捕获");
      });
    //商品列表有必传参数，参数内容是分页页面与条数
    this.getCount();
  },
  computed: {
    ...mapGetters(["getStateGoodsList"]),
  },
  methods: {
    //一级分类的选中方法
    cateChange(e) {
      //调取二级接口
      getCatelist({ pid: e })
        .then(res => {
          if (res.data.code == 200) {
            this.secondArr = res.data.list;
          }
        })
        .catch(err => {
          console.log(err, "错误捕获");
        });
    },
    //商品规格的选中方法
    specsChange(e) {
      //调取规格属性接口
      getSpecsinfo({ id: e })
        .then(res => {
          if (res.data.code == 200) {
            this.specsAttrs = res.data.list ? res.data.list[0].attrs : [];
          }
        })
        .catch(err => {
          console.log(err, "错误捕获");
        });
    },
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
    //获取商品数据的总条目
    getCount() {
      getGoodscount()
        .then((res) => {
          //console.log(res,"条目")
          if (res.data.code == 200) {
            this.total = res.data.list[0].total;
            if (this.total <= this.pageSize) {
              this.pageNum = 1;
            }
            this.$store.dispatch("getGoodsListAction", {
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
      this.$store.dispatch("getGoodsListAction", {
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
       first_cateid: "", //一级分类编号
        second_cateid: "", //二级分类编号
        goodsname: "", //商品名称
        price: "", //商品价格
        market_price: "", //市场价格
        img: "", //商品图片（文件）
        description: "", //商品描述
        specsid: "", //商品规格编号
        specsattr: "", //商品规格属性
        isnew: "1", //是否新品 1是2不是
        ishot: "1", //是否热卖推荐1是2不是
        status: false //状态1正常2禁用
      };
      this.img = "";
      this.fileList = [];
      //当关闭的时候，清空一下富文本编辑器
      //防止多次点击的时候，富文本编辑器重复
      this.$refs.editorInfo.innerHTML = "";
    },
    //打开添加弹框事件
    openDialog() {
      this.editor = null;
      this.isAdd = true;
      this.dialogFormVisible = true;
      //弹框加载的时候，渲染编辑器
      //利用延迟加载
      setTimeout(() => {
        this.editor = new E("#wangEditor");
        this.editor.create();
      }, 0);
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
          getGoodsdelete({ id })
            .then((res) => {
              console.log(res, "删除");
              if (res.data.code == 200) {
                this.getCount();
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
      setTimeout(() => {
        this.editor = new E("#wangEditor");
        this.editor.create();
      }, 0);
      getGoodsinfo({ id })
        .then((res) => {
          if (res.data.code == 200) {
            this.ruleForm = res.data.list;
             //对二级分类进行转化
            this.cateChange(this.ruleForm.first_cateid);
            //对规格规格属性进行判断
            this.specsChange(this.ruleForm.specsid);
            //规格属性数组转化
            this.ruleForm.specsattr = this.ruleForm.specsattr
              ? this.ruleForm.specsattr.split(",")
              : [];
            //转化一下img属性
            this.fileList = this.ruleForm.img
              ? [{ url: "http://localhost:3000" + this.ruleForm.img }]
              : [];
            //转化下是否新品是否热卖，转化成字符串
            this.ruleForm.ishot = this.ruleForm.ishot.toString();
            this.ruleForm.isnew = this.ruleForm.isnew.toString();
            //status要转化成true或者false
            this.ruleForm.status = this.ruleForm.status == 1 ? true : false;
            //转化商品描述
            this.ruleForm.description = this.editor.txt.html(
              this.ruleForm.description
            );
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
         //添加之前 要对入参进行类型转化
          let data = this.ruleForm;
          //对提交的表单信息进行数据的转化
          data.description = this.editor.txt.html();
          data.specsattr = this.ruleForm.specsattr
            ? this.ruleForm.specsattr.join(",")
            : "";
          data.status = data.status ? "1" : "2";
          //针对于文件上传内容进行转化
          let file = new FormData();
          for (let i in data) {
            file.append(i, data[i]);
          }
          file.append("img", this.img);
          if (this.isAdd) {
            getGoodsadd(file)
              .then((res) => {
                //当成功的时候，我们调取查询接口，关闭弹框并清空你的输入内容
                if (res.data.code == 200) {
                  //关闭弹框
                  this.dialogFormVisible = false;
                  //清空输入框
                  this.resetInfo();
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
            file.append("id", this.editId);
            //调取添加接口
            getGoodsedit(file)
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