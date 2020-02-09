import store from '@/store'
import {IDefaultModule} from '@/store/types'

const registeredStores: Array<string> = []

const registerStore = (name: string, module: IDefaultModule<any>) => {
  if (registeredStores.indexOf(name) === -1) {
    store.registerModule(name, module)
  }
}

export {registerStore}
