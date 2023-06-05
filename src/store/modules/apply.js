// import { searchSealApply } from '@/api/seal'
import { goodsOrderApi } from '@/api/goodsOrder'
const state = {
  count3: '',
  count4: '',
  count5: '',
  count6: '',
  count8: '',
  count11: ''
}

const mutations = {
  SET_COUNT_3: (state, num) => {
    state.count3 = num
  },
  SET_COUNT_4: (state, num) => {
    state.count4 = num
  },
  SET_COUNT_5: (state, num) => {
    state.count5 = num
  },
  SET_COUNT_6: (state, num) => {
    state.count6 = num
  },
  SET_COUNT_8: (state, num) => {
    state.count8 = num
  },
  SET_COUNT_11: (state, num) => {
    state.count11 = num
  }
}

const actions = {
  orderInfo({ commit }) {
    return new Promise((resolve, reject) => {
      goodsOrderApi.indexData().then(response => {
        if (response.data) {
          const { data } = response
          commit('SET_COUNT_3', data.countDto.count3)
          commit('SET_COUNT_4', data.countDto.count4)
          commit('SET_COUNT_5', data.countDto.count5)
          commit('SET_COUNT_6', data.countDto.count6)
          commit('SET_COUNT_8', data.countDto.count8)
          commit('SET_COUNT_11', data.countDto.count11)
        }
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
