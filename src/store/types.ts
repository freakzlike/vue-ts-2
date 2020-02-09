import {Module} from 'vuex/types'

export interface IRootState {
}

export interface IDefaultState {
}

export interface IDefaultModule<S> extends Module<S, IRootState> {
}
