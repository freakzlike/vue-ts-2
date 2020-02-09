import Dictionary from '@/types/Dictionary'
import {BaseClass} from '@/models/BaseClass'
import {Field} from './Field'

class BaseModel extends BaseClass {
  public static keyName: string
  public static fieldsDef: Dictionary<Field> = {}
  protected static _modelRegistered: boolean = false

  protected _data: Dictionary<any>
  protected _fields: Dictionary<Field> = {}

  constructor (data: Dictionary<any> = {}) {
    super()
    this._data = data

    if (!this.cls.keyName) {
      console.warn('Missing keyName for Model', this.constructor.name)
    }

    if (!this.cls._modelRegistered) {
      console.warn('Model is not registered', this.constructor.name)
    }

    this._bindFields()
  }

  public get val (): Dictionary<any> {
    return new Proxy(this, {
      get (target: any, name: string) {
        return target._data[name]
      }
    })
  }

  protected _bindFields () {
    this._fields = {}

    const fields = this.cls.fieldsDef
    for (const fieldName of Object.keys(fields)) {
      const field = fields[fieldName].clone()
      this._fields[fieldName] = field.bind(fieldName)
    }
  }

  public static register (): boolean {
    if (this._modelRegistered) return false

    this._modelRegistered = true
    return true
  }
}

export {BaseModel}
