import LazyValue from '@/types/LazyValue'

interface FieldDef {
  attributeName?: string,
  label?: LazyValue<string>
  hint?: LazyValue<string>
}

class Field {
  _name: (string | null) = null
  _def: FieldDef

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
}

class UUIDField extends Field {
}

class CharField extends Field {
}

export {FieldDef, Field, UUIDField, CharField}
