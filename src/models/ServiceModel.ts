import Dictionary from '@/types/Dictionary'
import {BaseModel} from '@/models/BaseModel'

type TServiceParent = Dictionary<string>

class ServiceModel extends BaseModel {
  static urls: {
    LIST: string
    DETAIL: string
  }

  static parents: Array<string> = []

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
      return new Model()
    }

    async filter (parents?: TServiceParent): Promise<Array<ServiceModel>> {
      const Model = this.model
      return [
        new Model(),
        new Model()
      ]
    }
  }

  static checkServiceParents (parents: TServiceParent = {}) {
    if (this.parents.length < Object.keys(parents).length) {
      if (Object.keys(parents).length > 0) {
        console.warn('Too much parents given', this.constructor.name, parents)
      }
    } else if (this.parents.length > 0) {
      const missingParents = this.parents.filter(name => !parents[name])
      if (missingParents.length) {
        console.warn('Missing parents', this.constructor.name, missingParents)
      }
    }
  }
}

export {ServiceModel, TServiceParent}
