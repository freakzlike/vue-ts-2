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
   * Field name
   */
  public get name (): string | null {
    return this._name
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
}

class UUIDField extends Field {
}

class CharField extends Field {
}

export {FieldDef, Field, UUIDField, CharField}
