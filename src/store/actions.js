import {getMenulist,getRolelist,getUserlist,getCatelist,getSpecslist
    ,getGoodslist} from '../util/axios'
const actions = {
    //封装一个获取菜单列表的方法
    getNavListAction({commit}) {
        getMenulist({istree:1})
            .then((res) => {
                console.log(res, "11左侧菜单的内容");
                if (res.data.code == 200) {
                     //列表获取成功的时候，提交mutations
                     commit('reqNavlist',res.data.list)
                } else {
                    this.$message.error(res.data.msg);
                    
                }
            })
            .catch((err) => {
                console.log(err, "错误捕获");
            });
    },
    getRoleListAction({commit}) {
        getRolelist()
            .then((res) => {
                //console.log(res, "11左侧菜单的内容");
                if (res.data.code == 200) {
                    //console.log(res.data,'角色列表')
                     //列表获取成功的时候，提交mutations
                     commit('reqRolelist',res.data.list)
                } else {
                    this.$message.error(res.data.msg);
                }
            })
            .catch((err) => {
                console.log(err, "错误捕获");
            });
    },
    getUserListAction({commit},pageInfo) {
        getUserlist(pageInfo)
            .then((res) => {
                //console.log(res, "1管理员的内容");
                if (res.data.code == 200) {
                     //列表获取成功的时候，提交mutations
                     commit('reqUserlist',res.data.list)
                } else {
                    this.$message.error(res.data.msg);
                }
            })
            .catch((err) => {
                console.log(err, "错误捕获");
            });
    },
    getCateListAction({commit}) {
        getCatelist({istree:1})
            .then((res) => {
                //console.log(res, "11左侧菜单的内容");
                if (res.data.code == 200) {
                     //列表获取成功的时候，提交mutations
                     commit('reqCatelist',res.data.list)
                } else {
                    this.$message.error(res.data.msg);
                }
            })
            .catch((err) => {
                console.log(err, "错误捕获");
            });
    },
    getSpecsListAction({commit},pageInfo) {
        getSpecslist(pageInfo)
            .then((res) => {
                //console.log(res, "11左侧菜单的内容");
                if (res.data.code == 200) {
                     //列表获取成功的时候，提交mutations
                     commit('reqSpecslist',res.data.list)
                } else {
                    this.$message.error(res.data.msg);
                }
            })
            .catch((err) => {
                console.log(err, "错误捕获");
            });
    },
    getGoodsListAction({ commit },pageInfo) {
        //调取商品规格列表
        getGoodslist(pageInfo)
            .then(res => {
                console.log(res, '内容')
                if (res.data.code == 200) {
                    //列表获取成功的时候，提交mutations
                    commit('reqGoodslist', res.data.list)
                } else {
                    this.$message.error(res.data.msg);
                }
            })
            .catch(err => {
                console.log(err, "错误捕获");
            });
    },
}
export default actions