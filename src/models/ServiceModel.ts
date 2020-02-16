import Dictionary from '@/types/Dictionary'
import {BaseModel} from '@/models/BaseModel'
import store from '@/store'
import {ServiceStoreFactory, ServiceStore, ServiceStoreOptions} from '@/models/ServiceStoreFactory'
import axios from '@/plugins/axios'

type ServiceParent = Dictionary<string>

/**
 * ServiceModel
 * Model with service interface to retrieve data from backend api
 */
class ServiceModel extends BaseModel {
  /**
   * Default URL definition for backend APIs
   * Fill either LIST/DETAIL or BASE url or use other urls by overwriting getListUrl/getDetailUrl
   */
  protected static urls: {
    BASE?: string | null
    LIST?: string | null,
    DETAIL?: string | null
  }

  /**
   * List of parent names to be used in url
   */
  protected static parents: Array<string> = []

  /**
   * Duration to cache requested data in seconds. 0: no cache. null: Cache forever
   */
  protected static cacheDuration: number | null = 30

  /**
   * Vuex store module factory to use
   */
  protected static storeFactory: typeof ServiceStoreFactory = ServiceStoreFactory

  /**
   * Function to return list url of model according to parents
   * @param parents
   */
  public static getListUrl (parents?: ServiceParent): string {
    if (this.urls.LIST) {
      return this.urls.LIST
    } else if (this.urls.BASE) {
      return this.urls.BASE
    } else {
      console.warn('Missing url configuration')
      return ''
    }
  }

  /**
   * Function to return detail url of model according to parents
   * @param id
   * @param parents
   */
  public static getDetailUrl (id: string, parents?: ServiceParent): string {
    if (this.urls.DETAIL) {
      return this.urls.DETAIL
    } else if (this.urls.BASE) {
      return this.urls.BASE + id + '/'
    } else {
      console.warn('Missing url configuration')
      return ''
    }
  }

  /**
   * Retrieve instance of ModelManager
   */
  public static get objects () {
    const ServiceClass = this.ModelManager
    return new ServiceClass(this)
  }

  /**
   * Manager class of model
   */
  protected static ModelManager = class {
    protected model: typeof ServiceModel

    constructor (model: typeof ServiceModel) {
      this.model = model
    }

    /**
     * Retrieve list of all model instances
     * @param parents
     */
    public async all (parents?: ServiceParent): Promise<Array<ServiceModel>> {
      return this.filter({}, parents)
    }

    /**
     * Retrieve specific model instance
     * @param id
     * @param parents
     */
    public async get (id: string, parents?: ServiceParent): Promise<ServiceModel> {
      const Model = this.model
      Model.checkServiceParents(parents)

      const options: ServiceStoreOptions = {
        key: 'detail#' + id,
        sendRequest: async (options: ServiceStoreOptions): Promise<Array<Dictionary<any>>> => {
          const response = await axios.get(this.model.getDetailUrl(id, parents))

          return response.data
        }
      }

      const data: Dictionary<any> = await Model.storeDispatch('getData', options)
      return new Model(data)
    }

    /**
     * Retrieve filtered list of all model instances
     * @param filterParams
     * @param parents
     */
    public async filter (filterParams: Dictionary<any>, parents?: ServiceParent): Promise<Array<ServiceModel>> {
      const Model = this.model
      Model.checkServiceParents(parents)

      const filterKey = Object.keys(filterParams).length ? 'list#' + JSON.stringify(filterParams) : 'list'

      const options: ServiceStoreOptions = {
        key: filterKey,
        sendRequest: async (options: ServiceStoreOptions): Promise<Array<Dictionary<any>>> => {
          const response = await axios.get(this.model.getListUrl(parents))

          return response.data
        }
      }

      const dataList: Array<Dictionary<any>> = await await Model.storeDispatch('getData', options)
      return dataList.map(data => new Model(data))
    }
  }

  /**
   * Check whether all required parent values have been given
   * @param parents
   */
  protected static checkServiceParents (parents: ServiceParent = {}): boolean {
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

  /**
   * Return name of vuex store
   */
  public static get storeName (): string {
    if (!this.keyName) {
      console.warn('Missing keyName for Model', this.constructor.name)
    }

    return 'service/' + this.keyName
  }

  /**
   * Dispatch vuex store action
   * @param action
   * @param payload
   */
  public static storeDispatch (action: string, payload?: any): Promise<any> {
    const actionName = this.storeName + '/' + action
    return store.dispatch(actionName, payload)
  }

  /**
   * Register model and vuex store
   */
  public static register (): boolean {
    if (!super.register()) return false

    store.registerModule(this.storeName, this.createStoreModule())
    return true
  }

  /**
   * Create vuex store module from storeFactory
   */
  protected static createStoreModule (): ServiceStore {
    return this.storeFactory(this.cacheDuration)
  }
}

export {ServiceModel, ServiceParent}
