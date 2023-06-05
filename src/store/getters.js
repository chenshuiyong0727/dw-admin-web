const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  routeAnimation: state => state.app.routeAnimation,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  count3: state => state.apply.count3,
  count4: state => state.apply.count4,
  count5: state => state.apply.count5,
  count6: state => state.apply.count6,
  count8: state => state.apply.count8,
  count11: state => state.apply.count11,
  showThreeRouter: state => state.page.showThreeRouter,
  unreadMsg: state => state.page.unreadMsg,
  projectTypeList: state => state.page.projectTypeList,
  projectLevelList: state => state.page.projectLevelList,
  projectStatusList: state => state.page.projectStatusList,
  userCareBubble: state => state.page.userCareBubble,
  authorityRoute: state => state.page.authorityRoute
}
export default getters
