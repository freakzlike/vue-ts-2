import Vue from 'vue'
import cu from '@/utils/common'
import Dictionary from '@/types/Dictionary'
import LazyValue from '@/types/LazyValue'

interface FieldDef {
  name: string
  attributeName?: string
  label?: LazyValue<string>
  hint?: LazyValue<string>
  extend?: Field,
  options?: LazyValue<Dictionary<any>>

  valueGetter?: (data: any) => any
  valueSetter?: (value: any, data: Dictionary<any>) => void
}

/**
 * FieldDef
 {
    name: 'label',
    attributeName: 'attributeName',
    label: i18n.lazy.t(''),
    hint: i18n.lazy.t(''),
    extend: Field,
    options: {}
  }
 */

class Field {
  _def: FieldDef
  _data: Dictionary<any>

  /**
   * Constructor
   * @param {Object} definition Field definition
   * @param {Object} [data={}] Optional data
   */
  constructor (definition: FieldDef, data?: Dictionary<any>) {
    this._def = definition
    this._data = data || {}
  }

  /**
   * Clone current field instance and return new instance
   * @returns {Field}
   */
  clone (): Field {
    const FieldClass = <typeof Field> this.constructor
    return new FieldClass(this._def, this._data)
  }

  /**
   * Name of field
   * @returns {String}
   */
  get name (): string {
    return this._def.name
  }

  /**
   * Name of attribute in data
   * @returns {String}
   */
  get attributeName (): string {
    return this._def.attributeName || this.name
  }

  /**
   * Field label
   * @returns {Promise<string>}
   */
  get label (): Promise<string> {
    return cu.promiseEval(this._def.label, this)
  }

  /**
   * Field hint
   * @returns {Promise<string>}
   */
  get hint (): Promise<string> {
    return cu.promiseEval(this._def.hint, this)
  }

  /**
   * Field definition
   * @returns {FieldDef}
   */
  get definition (): FieldDef {
    return this._def
  }

  /**
   * Field data
   * @returns {Object}
   */
  get data (): Dictionary<any> {
    return this._data
  }

  /**
   * Field options
   * @returns {Promise}
   */
  get options (): Promise<any> {
    return cu.promiseEval(this._def.options, this).then(options => options || {})
  }

  /**
   * Field native value
   * @returns {Promise<Any>}
   */
  get value (): Promise<any> | any {
    return this.callValueGetter(this.data).then(value => cu.promiseEval(value, this))
  }

  /**
   * Set given value to data
   * @param {Any} value
   */
  set value (value: any) {
    this.callValueSetter(value, this.data)
  }

  /**
   * Retrieve async option from field options
   * @param {string} option Option name
   * @param {Array<Any>=null} args Optional arguments to evaluate option
   * @returns {Promise<Any>}
   */
  async getOption (option: string, args?: Array<any>): Promise<any> {
    const options = await this.options
    const _args = args || []
    return cu.promiseEval(options[option], this, ..._args)
  }

  _getDefAttribute (name: string, fromStatic?: boolean): any {
    const _def = <Dictionary<any>> this._def
    if (_def[name]) {
      return _def[name]
    } else if (fromStatic) {
      return (<Dictionary<any>> this.constructor)[name]
    } else {
      return (<Dictionary<any>> this)[name]
    }
  }

  /**
   * Call valueGetter either from field definition or from current instance
   * @param {Object} data
   * @returns {Promise<Any>}
   */
  callValueGetter (data: any): Promise<any> {
    const valueGetter = this._getDefAttribute('valueGetter')
    return cu.promiseEval(valueGetter, this, data)
  }

  /**
   * Retrieve value from data structure according to attributeName
   * @param {Object|Any} data
   * @returns {null|Any}
   */
  valueGetter (data: any): any {
    if (!data || typeof data !== 'object') return null

    if (!this.attributeName.includes('.')) {
      const value = data[this.attributeName]
      return !cu.isNull(value) ? value : null
    }

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

  /**
   * Call valueSetter either from field definition or from current instance
   * @param {Any} value
   * @param {Dictionary<any>} data
   */
  callValueSetter (value: any, data: Dictionary<any>) {
    const valueSetter = this._getDefAttribute('valueSetter')
    cu.eval(valueSetter, this, value, data)
  }

  /**
   * Set value according to attributeName to data
   * @param {Any} value
   * @param {Dictionary<any>} data
   */
  valueSetter (value: any, data: Dictionary<any>) {
    if (!this.attributeName.includes('.')) {
      Vue.set(data, this.attributeName, value)
    } else {
      const subFields = this.attributeName.split('.')

      // Retrieve start position for set
      let subFieldName
      let fieldIndex
      let currentData = data
      for ([fieldIndex, subFieldName] of subFields.entries()) {
        if (fieldIndex + 1 === subFields.length) {
          break
        }

        if (Object.prototype.hasOwnProperty.call(currentData, subFieldName) &&
          !cu.isNull(currentData[subFieldName])) {
          currentData = currentData[subFieldName]
        } else {
          break
        }
      }
      if (typeof fieldIndex !== 'number' || !subFieldName) return

      // Build nested object which will be set as value
      const setValue = subFields.splice(fieldIndex + 1).reduceRight((obj, subFieldName) => {
        const newObj: Dictionary<any> = {}
        newObj[subFieldName] = obj
        return newObj
      }, value)

      Vue.set(currentData, subFieldName, setValue)
    }
  }

  /**
   * TODO: Unittest + docs
   * @returns {Promise}
   */
  get displayComponent () {
    const displayComponent = this._getDefAttribute('displayComponent', true)
    return cu.promiseEval(displayComponent, this)
  }

  /**
   * TODO: Unittest + docs
   * @returns {Promise}
   */
  get inputComponent () {
    const inputComponent = this._getDefAttribute('inputComponent', true)
    return cu.promiseEval(inputComponent, this)
  }
}

export {FieldDef, Field}
export default Field
