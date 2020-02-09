import {ActionTree, MutationTree} from 'vuex/types'
import {IDefaultModule, IDefaultState, IRootState} from '../types'

interface ServiceStoreState extends IDefaultState {
  count: number
}

const state: () => ServiceStoreState = () => ({
  count: 0
})

const actions: ActionTree<ServiceStoreState, IRootState> = {
  async getData (context, {id, parents}) {
    context.commit('increaseCount')

    console.log('getData', id, parents)
    return {
      id: id,
      name: 'Neuer Name ' + context.state.count
    }
  }
}

const mutations: MutationTree<ServiceStoreState> = {
  increaseCount (state: ServiceStoreState) {
    state.count++
  }
}

const serviceStore: IDefaultModule<ServiceStoreState> = {
  namespaced: true,
  state,
  actions,
  mutations
}

export {serviceStore}
