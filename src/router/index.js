import Vue from 'vue'
import Router from 'vue-router'

//路由懒加载
//const Login = ()=>import('@/components/pages/login')

Vue.use(Router)

export default new Router({
  mode:'history',
  routes: [
    {
      path: '/login',
      component: () => import('@/components/pages/login')
    },
    {
      path: '/index',
      component: () => import('@/components/pages/index'),
      children:[
        {
          path:'/home',
          component:()=>import('@/components/views/home')
        },
        {
          path:'/welcome',
          component:()=>import('@/components/views/welcome')
        },
        {
          path:'/menu',
          component:()=>import('@/components/views/menu'),
          meta:{
            select:'/menu'
          }
        },
        {
          path:'/role',
          component:()=>import('@/components/views/role'),
          meta:{
            select:'/role'
          }
        },
        {
          path:'/user',
          component:()=>import('@/components/views/user'),
          meta:{
            select:'/user'
          }
        },
        {
          path:'/sort',
          component:()=>import('@/components/views/sort'),
          meta:{
            select:'/sort'
          }
        },
        {
          path:'/specs',
          component:()=>import('@/components/views/specs'),
          meta:{
            select:'/specs'
          }
        },
        {
          path:'/goods',
          component:()=>import('@/components/views/goods'),
          meta:{
            select:'/goods'
          }
        },{
          path:'',
          redirect:'/welcome'
        }
      ]
    },
    {
      path: '*',
      redirect: '/login'
    }
  ]
})
