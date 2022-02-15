//引入封装好的axios实例方法
import http from './axios'

//菜单接口
//添加
export function getMenuAdd(data){
    return http.post('/menuadd',data)
}
//列表
export function getMenulist(params){
    return http.get('/menulist',{
        params
    })
}
//获取一条数据
export function getMenuinfo(params){
    return http.get('/menuinfo',{
        params
    })
}
//修改
export function getMenuedit(data){
    return http.post('/menuedit',data)
}
//删除
export function getMenudelete(data){
    return http.post('/menudelete',data)
}
/* ------------------------------------------------------------ */
//角色接口
//添加
export function getRoleadd(data){
    return http.post('/roleadd',data)
}
//列表
export function getRolelist(params){
    return http.get('/rolelist',{
        params
    })
}
//获取一条数据
export function getRoleinfo(params){
    return http.get('/roleinfo',{
        params
    })
}
//修改
export function getRoleedit(data){
    return http.post('/roleedit',data)
}
//删除
export function getRoledelete(data){
    return http.post('/roledelete',data)
}
//管理员管理接口
//添加
export function getUseradd(data){
    return http.post('/useradd',data)
}
//管理员总数
export function getUsercount(params){
    return http.get('/usercount',{
        params
    })
}
//列表分页
export function getUserlist(params){
    return http.get('/userlist',{
        params
    })
}
//获取一条数据
export function getUserinfo(params){
    return http.get('/userinfo',{
        params
    })
}
//修改
export function getUseredit(data){
    return http.post('/useredit',data)
}
//删除
export function getUserdelete(data){
    return http.post('/userdelete',data)
}
//管理员登录
export function getUserlogin(data){
    return http.post('/userlogin',data)
}
/* ========商品分类接口======= */
//添加
export function getCateadd(data){
    return http.post('/cateadd',data)
}
//列表
export function getCatelist(params){
    return http.get('/catelist',{
        params
    })
}
//获取一条数据
export function getCateinfo(params){
    return http.get('/cateinfo',{
        params
    })
}
//修改
export function getCateedit(data){
    return http.post('/cateedit',data)
}
//删除
export function getCatedelete(data){
    return http.post('/catedelete',data)
}
/* ========商品规格接口======= */
//添加
export function getSpecsadd(data){
    return http.post('/specsadd',data)
}
//管理员总数（用于计算分页）
export function getSpecscount(params){
    return http.get('/specscount',{
        params
    })
}

//列表(分页)
export function getSpecslist(params){
    return http.get('/specslist',{
        params
    })
}
//获取一条数据
export function getSpecsinfo(params){
    return http.get('/specsinfo',{
        params
    })
}
//修改
export function getSpecsedit(data){
    return http.post('/specsedit',data)
}
//删除
export function getSpecsdelete(data){
    return http.post('/specsdelete',data)
}
/* ========商品管理接口======= */
//添加
export function getGoodsadd(data){
    return http.post('/goodsadd',data)
}
//管理员总数（用于计算分页）
export function getGoodscount(params){
    return http.get('/goodscount',{
        params
    })
}
//列表(分页)
export function getGoodslist(params){
    return http.get('/goodslist',{
        params
    })
}
//获取一条数据
export function getGoodsinfo(params){
    return http.get('/goodsinfo',{
        params
    })
}
//修改
export function getGoodsedit(data){
    return http.post('/goodsedit',data)
}
//删除
export function getGoodsdelete(data){
    return http.post('/goodsdelete',data)
}