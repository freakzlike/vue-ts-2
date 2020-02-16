import LazyValue from '@/types/LazyValue'
import cu from '@/utils/common'
import {BaseClass} from '@/models/BaseClass'

interface FieldDef {
  attributeName?: string,
  label?: LazyValue<string>
  hint?: LazyValue<string>
}

class FieldNotBoundException extends Error {
  constructor (field: Field) {
    super('Field "' + field.cls.name + '" not bound or fieldName not set on new')
  }
}

class Field extends BaseClass {
  /**
   * Field name
   */
  protected _name: (string | null) = null

  /**
   * Field definition
   */
  protected _def: FieldDef

  constructor (def: FieldDef = {}, fieldName: (string | null) = null) {
    super()
    this._def = def
    this._name = fieldName
  }

  public clone (): Field {
    const FieldClass = <typeof Field> this.constructor
    return new FieldClass(this._def, this._name)
  }

  /**
   * Bind field with field name and return a new instance
   * @param fieldName
   */
  public bind (fieldName: string): Field {
    const FieldClass = <typeof Field> this.constructor
    return new FieldClass(this._def, fieldName)
  }

  /**
   * Field name
   */
  public get name (): string {
    if (this._name === null) {
      throw new FieldNotBoundException(this)
    }

    return this._name
  }

  /**
   * Name of attribute in data
   * @returns {String}
   */
  public get attributeName (): string {
    return this._def.attributeName || this.name
  }

  /**
   * Field definition
   */
  public get definition (): FieldDef {
    return this._def
  }

  /**
   * Field label
   */
  public get label (): Promise<string> {
    return cu.promiseEval(this._def.label, this)
  }

  /**
   * Field hint
   */
  public get hint (): Promise<string> {
    return cu.promiseEval(this._def.hint, this)
  }

  /**
   * Retrieve value from data structure according to attributeName
   */
  public valueGetter (data: any): any {
    if (!data || typeof data !== 'object') return null

    // No nested attribute name
    if (!this.attributeName.includes('.')) {
      const value = data[this.attributeName]
      return !cu.isNull(value) ? value : null
    }

    // Attribute name contains nested attributes e.g. obj.nested.field
    const subFields = this.attributeName.split('.')
    let currentObject = data
    let subFieldName
    for (subFieldName of subFields) {
      currentObject = currentObject[subFieldName]
      if (cu.isNull(currentObject)) {
        return null
      }
    }

    return !cu.isNull(currentObject) ? currentObject : null
  }
}

class UUIDField extends Field {
}

class CharField extends Field {
}

export {FieldDef, FieldNotBoundException, Field, UUIDField, CharField}
