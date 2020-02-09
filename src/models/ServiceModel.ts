import Dictionary from '@/types/Dictionary'
import {BaseModel} from '@/models/BaseModel'
import store from '@/store'
import {serviceStore} from '@/store/modules/serviceStore'

type TServiceParent = Dictionary<string>

class ServiceModel extends BaseModel {
  static urls: {
    LIST: string
    DETAIL: string
  }

  static parents: Array<string> = []
  static storeModule: typeof serviceStore = serviceStore

  static get objects () {
    const ServiceClass = this.ModelManager
    return new ServiceClass(this)
  }

  static ModelManager = class {
    model: typeof ServiceModel

    constructor (model: typeof ServiceModel) {
      this.model = model
    }

    async all (parents?: TServiceParent): Promise<Array<ServiceModel>> {
      const Model = this.model
      return [
        new Model(),
        new Model()
      ]
    }

    async get (id: string, parents?: TServiceParent): Promise<ServiceModel> {
      const Model = this.model
      Model.checkServiceParents(parents)
      const data = await Model.storeDispatch('getData', {id, parents})
      return new Model(data)
    }

    async filter (parents?: TServiceParent): Promise<Array<ServiceModel>> {
      const Model = this.model
      return [
        new Model(),
        new Model()
      ]
    }
  }

  static checkServiceParents (parents: TServiceParent = {}): boolean {
    if (this.parents.length < Object.keys(parents).length) {
      if (Object.keys(parents).length > 0) {
        console.warn('Too much parents given', this.constructor.name, parents)
        return false
      }
    } else if (this.parents.length > 0) {
      const missingParents = this.parents.filter(name => !parents[name])
      if (missingParents.length) {
        console.warn('Missing parents', this.constructor.name, missingParents)
        return false
      }
    }

    return true
  }

  public static get storeName (): string {
    if (!this.keyName) {
      console.warn('Missing keyName for Model', this.constructor.name)
    }

    return 'service' + this.keyName
  }

  public static storeDispatch (action: string, payload?: any): Promise<any> {
    const actionName = this.storeName + '/' + action
    return store.dispatch(actionName, payload)
  }

  public static register (): boolean {
    if (!super.register()) return false

    store.registerModule(this.storeName, this.storeModule)
    return true
  }
}

export {ServiceModel, TServiceParent}
