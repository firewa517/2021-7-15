//引入axios插件
import axios from 'axios'
import router from '../../router'

//重新创建一个axios实例(自定义配置)
const http = axios.create({
    baseURL: '/api'
})

//创建请求拦截
http.interceptors.request.use((config) => {
    //console.log(config, '请求拦截')
    config.headers.authorization = sessionStorage.getItem('token')
    return config
}, (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
})

http.interceptors.response.use((res) => {
    //console.log(res, '响应拦截')
    //可以控制接口的返回信息
    //可以全局拦截错误
    if(res.data.code == 500){
        //重新跳转到登录
        router.push('/login')
    }else if(res.data.code == 403){
        router.push('/login')
    }
    return res
}, (err) => {
    return Promise.reject(err)
})

//创建响应拦截

export default http