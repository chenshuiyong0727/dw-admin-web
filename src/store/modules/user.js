import { userContainerApi } from '@/api/user'
import { setCookieByName, removeCookieByName, getCookieByName } from '@/utils/auth'
import { resetRouter } from '@/router'
// import { encrypt } from '@/utils'

const getDefaultState = () => {
  return {
    token: getCookieByName('org_token_auth'),
    // sessionId: getCookieByName('sessionId'),
    name: '',
    avatar: '',
    userId: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  // SET_SESSION_ID: (state, sessionId) => {
  //   state.sessionId = sessionId
  // },
  SET_REFRESH_TOKEN: (state, refreshToken) => {
    state.refreshToken = refreshToken
  },
  SET_USER_ID: (state, userId) => {
    state.userId = userId
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  refreshNewToken({ commit }, token) {
    commit('SET_TOKEN', token)
  },
  // user login
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      userContainerApi.login({ ...userInfo }).then(response => {
        if (response.data) {
          const { data } = response
          sessionStorage.setItem('functionList', JSON.stringify(data.functionList))
          sessionStorage.setItem('tokenExpireTime', data.tokenExpireTime)
          sessionStorage.setItem('projectList', JSON.stringify(data.projectList))
          sessionStorage.setItem('systemList', JSON.stringify(data.systemList))
          commit('SET_TOKEN', data.token)
          // commit('SET_SESSION_ID', data.sessionId)
          commit('SET_USER_ID', data.userId)
          commit('SET_NAME', data.userAccount)
          setCookieByName('org_token_auth', data.token)
          // setCookieByName('session_id', data.sessionId)
          setCookieByName('refresh_org_token_auth', data.refreshToken)
          setCookieByName('user_id', data.userId)
          setCookieByName('user_name', data.userAccount)
        }
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout 库存
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      userContainerApi.logout().then(res => {
        if (res.subCode === 1000) {
          removeCookieByName('org_token_auth')
          removeCookieByName('refresh_org_token_auth')
          removeCookieByName('user_id')
          resetRouter()
          sessionStorage.clear() // remove all session
          commit('RESET_STATE')
          resolve()
        }
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      // removeToken() // must remove  token  first
      // removeRefreshToken()
      // removeUserId()
      removeCookieByName('org_token_auth')
      removeCookieByName('refresh_org_token_auth')
      removeCookieByName('user_id')
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

