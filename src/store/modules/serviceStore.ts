import {MutationTree} from 'vuex/types'
import {IDefaultModule, IDefaultState} from '../types'

interface ServiceStoreState extends IDefaultState {
  count: number
}

const state: () => ServiceStoreState = () => ({
  count: 0
})

const mutations: MutationTree<ServiceStoreState> = {
  increaseCount (state: ServiceStoreState) {
    state.count++
  }
}

const serviceStore: IDefaultModule<ServiceStoreState> = {
  namespaced: true,
  state,
  mutations
}

export {serviceStore}
