import LazyValue from '@/types/LazyValue'
import cu from '@/utils/common'

interface FieldDef {
  attributeName?: string,
  label?: LazyValue<string>
  hint?: LazyValue<string>
}

class Field {
  protected _name: (string | null) = null
  protected _def: FieldDef

  constructor (def: FieldDef = {}, fieldName: (string | null) = null) {
    this._def = def
    this._name = fieldName
  }

  clone (): Field {
    const FieldClass = <typeof Field> this.constructor
    return new FieldClass(this._def, this._name)
  }

  bind (fieldName: string): Field {
    const FieldClass = <typeof Field> this.constructor
    return new FieldClass(this._def, fieldName)
  }

  /**
   * Field label
   * @returns {Promise<string>}
   */
  public get label (): Promise<string> {
    return cu.promiseEval(this._def.label, this)
  }

  /**
   * Field hint
   * @returns {Promise<string>}
   */
  public get hint (): Promise<string> {
    return cu.promiseEval(this._def.hint, this)
  }
}

class UUIDField extends Field {
}

class CharField extends Field {
}

export {FieldDef, Field, UUIDField, CharField}
