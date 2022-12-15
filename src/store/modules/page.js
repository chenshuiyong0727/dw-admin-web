const state = {
  showThreeRouter: false,
  unreadMsg: 0,
  // 项目类型下拉选项值
  projectTypeList: [],
  // 项目级别下拉选项值
  projectLevelList: [],
  // 项目状态下拉选项值
  projectStatusList: [],
  // 用户关怀 气泡提示
  userCareBubble: {
    myCount: 0,
    toBePartneredCount: 0,
    willAssignCount: 0
  },
  // 当前node模块下的路由
  authorityRoute: []
}
const mutations = {
  CHANGE_STATE: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  },
  CHANGE_BUBBLE_STATE: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key][Object.keys(value)[0]] = Object.values(value)[0]
    }
  }
}

const actions = {
  changePageType({ commit }, data) {
    commit('CHANGE_STATE',
      { key: Object.keys(data)[0], value: Object.values(data)[0] })
  },
  changeUnreadMsg({ commit }, data) {
    commit('CHANGE_STATE',
      { key: Object.keys(data)[0], value: Object.values(data)[0] })
  },
  changeProjectTypeList({ commit }, data) {
    commit('CHANGE_STATE',
      { key: Object.keys(data)[0], value: Object.values(data)[0] })
  },
  changeProjectLevelList({ commit }, data) {
    commit('CHANGE_STATE',
      { key: Object.keys(data)[0], value: Object.values(data)[0] })
  },
  changeProjectStatusList({ commit }, data) {
    commit('CHANGE_STATE',
      { key: Object.keys(data)[0], value: Object.values(data)[0] })
  },
  changeUserCareBubble({ commit }, data) {
    commit('CHANGE_BUBBLE_STATE',
      { key: Object.keys(data)[0], value: Object.values(data)[0] })
  },
  changeAuthorityRoute({ commit }, data) {
    commit('CHANGE_STATE',
      { key: Object.keys(data)[0], value: Object.values(data)[0] })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
