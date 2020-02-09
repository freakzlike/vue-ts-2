import Dictionary from '@/types/Dictionary'
import {BaseModel} from '@/models/BaseModel'
import store from '@/store'
import {serviceStore, ServiceStoreOptions} from '@/store/modules/serviceStore'
import axios from '@/plugins/axios'

type TServiceParent = Dictionary<string>

class ServiceModel extends BaseModel {
  static urls: {
    BASE?: string | null
    LIST?: string | null,
    DETAIL?: string | null
  }

  static parents: Array<string> = []
  static storeModule: typeof serviceStore = serviceStore

  static getListUrl (parents?: TServiceParent): string {
    if (this.urls.LIST) {
      return this.urls.LIST
    } else if (this.urls.BASE) {
      return this.urls.BASE
    } else {
      console.warn('Missing url configuration')
      return ''
    }
  }

  static getDetailUrl (id: string, parents?: TServiceParent): string {
    if (this.urls.DETAIL) {
      return this.urls.DETAIL
    } else if (this.urls.BASE) {
      return this.urls.BASE + id + '/'
    } else {
      console.warn('Missing url configuration')
      return ''
    }
  }

  static get objects () {
    const ServiceClass = this.ModelManager
    return new ServiceClass(this)
  }

  static ModelManager = class {
    model: typeof ServiceModel

    constructor (model: typeof ServiceModel) {
      this.model = model
    }

    public async all (parents?: TServiceParent): Promise<Array<ServiceModel>> {
      return this.filter({}, parents)
    }

    public async get (id: string, parents?: TServiceParent): Promise<ServiceModel> {
      const Model = this.model
      Model.checkServiceParents(parents)

      const options: ServiceStoreOptions = {
        key: 'detail#' + id,
        sendRequest: async (options: ServiceStoreOptions): Promise<Array<Dictionary<any>>> => {
          const response = await axios.get(this.model.getDetailUrl(id, parents))

          return response.data
        }
      }

      const data: Dictionary<any> = await await Model.storeDispatch('getData', options)
      return new Model(data)
    }

    public async filter (filterParams: Dictionary<any>, parents?: TServiceParent): Promise<Array<ServiceModel>> {
      const Model = this.model
      Model.checkServiceParents(parents)

      const options: ServiceStoreOptions = {
        key: 'list#' + JSON.stringify(filterParams),
        sendRequest: async (options: ServiceStoreOptions): Promise<Array<Dictionary<any>>> => {
          const response = await axios.get(this.model.getListUrl(parents))

          return response.data
        }
      }

      const dataList: Array<Dictionary<any>> = await await Model.storeDispatch('getData', options)
      return dataList.map(data => new Model(data))
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
