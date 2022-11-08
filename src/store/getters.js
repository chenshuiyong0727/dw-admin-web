const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  routeAnimation: state => state.app.routeAnimation,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  showThreeRouter: state => state.page.showThreeRouter,
  unreadMsg: state => state.page.unreadMsg,
  projectTypeList: state => state.page.projectTypeList,
  projectLevelList: state => state.page.projectLevelList,
  projectStatusList: state => state.page.projectStatusList,
  userCareBubble: state => state.page.userCareBubble,
  authorityRoute: state => state.page.authorityRoute
}
export default getters
