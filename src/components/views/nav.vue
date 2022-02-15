<template>
  <div>
    <!-- 侧边栏导航内容 -->
    <!--     
  background-color	菜单的背景色（仅支持 hex 格式）
    text-color	菜单的文字颜色（仅支持 hex 格式）
    active-text-color	当前激活菜单的文字颜色（仅支持 hex 格式）
    default-active	当前激活菜单的 index 
    是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转

    default-active 它不能是一个字符串，会出现bug。我们可以把它设定为变量。根据不同的地址去区分，当用户刷新的时候，还选中用户之前选中的状态
    -->
    <el-row>
      <el-col :span="24">
        <el-menu
          :default-active="defActive"
          class="el-menu-vertical-demo"
          background-color="#3D5F81"
          text-color="#fff"
          active-text-color="#ffd04b"
          router
          unique-opened
        >
          <el-menu-item index="/home">
            <i class="el-icon-menu"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <el-submenu
            v-for="(list, idx) in getStateNavList"
            :index="idx.toString()"
            :key="list.id"
          >
            <template slot="title">
              <i class="list.icon"></i>
              <span>{{ list.title }}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item
                v-for="item in list.children"
                :index="item.url"
                :key="item.id"
                >{{item.title}}</el-menu-item
              >
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
export default {
  data() {
    return {
      defActive: "",
    };
  },
  computed:{
    ...mapGetters(['getStateNavList'])
  },
  mounted() {
    //挂载
    //console.log(this.getStateNavList);
    //第一种方法
    this.defActive = this.$route.path
    console.log(this.$route.path)
    console.log(this.defActive)
    //第二种方法 通过meta标签去渲染内容
    //this.defActive = this.$route.meta.select;
    //调取菜单列表
    this.$store.dispatch('getNavListAction')
  },
};
</script>
<style lang="" scoped>
.el-menu {
  min-height: 600px;
}
</style>