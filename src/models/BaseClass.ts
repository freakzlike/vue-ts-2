import Dictionary from '@/types/Dictionary'

class BaseClass {
  get cls (): Dictionary<any> {
    return this.constructor
  }

  static get cls (): Dictionary<any> {
    return this.constructor
  }
}

export {BaseClass}
