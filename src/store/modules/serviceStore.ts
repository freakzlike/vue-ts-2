import Vue from 'vue'
import Dictionary from '@/types/Dictionary'
import {ActionTree, MutationTree} from 'vuex/types'
import {IDefaultModule, IDefaultState, IRootState} from '../types'

interface ServiceStoreStateData {
  expires?: number,
  data: any
}

interface ServiceStoreState extends IDefaultState {
  _data: Dictionary<ServiceStoreStateData>
  _requests: Dictionary<Promise<any>>,
  cacheExpires: number | null
}

interface ServiceStoreOptions {
  key: string,
  sendRequest: (options: ServiceStoreOptions) => Promise<any>,
  args?: Dictionary<any>
}

const state: () => ServiceStoreState = () => ({
  _data: {},
  _requests: {},
  cacheExpires: 5
})

const actions: ActionTree<ServiceStoreState, IRootState> = {
  async getData ({state, dispatch}, options: ServiceStoreOptions) {
    const key = options.key
    if (Object.prototype.hasOwnProperty.call(state._data, key)) {
      const data = state._data[key]
      if (!data.expires || data.expires > new Date().getTime()) {
        return data.data
      }
    }

    return dispatch('loadData', options)
  },

  async loadData ({state, commit}, options: ServiceStoreOptions) {
    const key = options.key
    if (Object.prototype.hasOwnProperty.call(state._requests, key) && state._requests[key] !== null) {
      return state._requests[key]
    }

    const request = options.sendRequest(options).then(data => {
      commit('_setData', {data, key})

      return data
    })

    commit('_setRequest', {request, key})
    return request
  }
}

const mutations: MutationTree<ServiceStoreState> = {
  _setData (state: ServiceStoreState, {data, key}: { data: Dictionary<any>, key: string }) {
    if (state.cacheExpires !== 0) {
      const _data: ServiceStoreStateData = {data}

      if (state.cacheExpires !== null) {
        _data.expires = new Date().getTime() + (state.cacheExpires * 1000)
      }

      Vue.set(state._data, key, _data)
    }

    Vue.delete(state._requests, key)
  },

  _setRequest (state, {request, key}: { request: Promise<any>, key: string }) {
    Vue.set(state._requests, key, request)
  },

  clean (state) {
    let key
    const expiredTime = new Date().getTime()
    for (key of Object.keys(state._data)) {
      const expires = state._data[key].expires
      if (expires && expires < expiredTime) {
        Vue.delete(state._data, key)
      }
    }
  }
}

const serviceStore: IDefaultModule<ServiceStoreState> = {
  namespaced: true,
  state,
  actions,
  mutations
}

export {serviceStore, ServiceStoreOptions}
