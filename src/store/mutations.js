const mutations = {
    reqNavlist(state, data) {
        state.navList = data
    },
    reqRolelist(state, data) {
        state.roleList = data
    },
    reqUserlist(state, data) {
        state.userList = data
    },
    reqCatelist(state, data) {
        state.cateList = data
    },
    reqSpecslist(state, data) {
        state.specsList = data
    },
    reqGoodslist(state, data) {
        state.goodsList = data
    }
}
export default mutations