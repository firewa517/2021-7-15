<template>
  <div>
    <el-container>
      <el-header>XXX大型后台管理系统</el-header>
      <el-container>
        <el-aside width="200px">
            <v-nav></v-nav>
        </el-aside>
        <el-main>
            <!-- 二级路由的出口 -->
            <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import vNav from '../views/nav'
export default {
   components:{
        vNav
    }
};
</script>
<style lang="" scoped>
.el-header {
  background: #518ecb;
  color: aliceblue;
  text-align: center;
  line-height: 60px;
  letter-spacing: 20px;
  font-size: 24px;
}
</style>