import Dictionary from '@/types/Dictionary'
import {BaseClass} from '@/models/BaseClass'
import {Field} from './Field'

/**
 * BaseModel class
 */
class BaseModel extends BaseClass {
  /**
   * Name to use for unique model identification
   * Will be used for vuex store name
   */
  public static keyName: string

  // noinspection JSUnusedGlobalSymbols
  /**
   * Field definitions for current model
   * e.g:
   * {id: new UUIDField(), name: new CharField()}
   */
  protected static fieldsDef: Dictionary<Field> = {}

  /**
   * Flag whether model has be registered or not
   */
  protected static _modelRegistered: boolean = false

  /**
   * Model data
   */
  protected _data: Dictionary<any>

  /**
   * Bound field objects of model
   */
  protected _fields: Dictionary<Field> = {}

  /**
   * Constructor
   * @param data Model data
   */
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

  /**
   * Getter with values to return data of model
   * Can be accessed as object (e.g. for field name 'description': val.description)
   */
  public get val (): Dictionary<any> {
    return new Proxy(this, {
      get (target: any, name: string) {
        // TODO: Use field.value
        return target._data[name]
      }
    })
  }

  /**
   * Bind fields from fieldsDef to _fields
   * @private
   */
  protected _bindFields (): void {
    this._fields = {}

    const fields = this.cls.fieldsDef
    for (const fieldName of Object.keys(fields)) {
      const field = fields[fieldName].clone()
      this._fields[fieldName] = field.bind(fieldName)
    }
  }

  /**
   * Register model to perform unique actions
   */
  public static register (): boolean {
    if (this._modelRegistered) return false

    this._modelRegistered = true
    return true
  }
}

export {BaseModel}
