import Dictionary from '@/types/Dictionary'
import {Field} from './Field'

class BaseModel {
  static fields: Dictionary<Field> = {}

  _data: Dictionary<any>
  _fields: Dictionary<Field> = {}

  constructor (data: Dictionary<any> = {}) {
    this._data = data
  }

  _bindFields () {
    this._fields = {}

    const statics = <Dictionary<any>> this.constructor
    for (const fieldName of statics.fields) {
      const field = statics.fields[fieldName].clone()
      this._fields[fieldName] = field.bind(fieldName)
    }
  }
}

export {BaseModel}
