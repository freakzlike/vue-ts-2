import {Field, FieldDef} from '@/fields/Field'
import Dictionary from '@/types/Dictionary'

describe('fields/Field.js', () => {
  describe('constructor', () => {
    it('should create Field', () => {
      const def: FieldDef = {name: 'field', label: 'field label'}
      const data = {field: 'value'}

      const field = new Field(def, data)
      expect(field._def).toBe(def)
      expect(field._data).toBe(data)
    })

    it('should create Field with no data', () => {
      const def: FieldDef = {name: 'field', label: 'field label'}

      const field = new Field(def)
      expect(field._def).toBe(def)
      expect(field._data).toEqual({})
    })
  })

  describe('clone', () => {
    it('should clone Field', () => {
      const def: FieldDef = {name: 'field', label: 'field label'}
      const data = {field: 'value'}

      const oldObj = new Field(def, data)
      const newObj = oldObj.clone()

      expect(oldObj).not.toBe(newObj)
      expect(oldObj._def).toBe(newObj._def)
      expect(oldObj._data).toBe(newObj._data)
    })
  })

  /**
   * Getters
   */
  describe('getters', () => {
    describe('name', () => {
      it('should get name', () => {
        const def: FieldDef = {name: 'field', label: 'field label'}

        const field = new Field(def)
        expect(field.name).toBe(def.name)
      })
    })

    describe('attributeName', () => {
      it('should get attributeName', () => {
        const def: FieldDef = {name: 'field', attributeName: 'field.attribute'}

        const field = new Field(def)
        expect(field.attributeName).toBe(def.attributeName)
      })

      it('should get default attributeName', () => {
        const def: FieldDef = {name: 'field'}

        const field = new Field(def)
        expect(field.attributeName).toBe(def.name)
      })
    })

    describe('label', () => {
      it('should get label string', async () => {
        const def: FieldDef = {name: 'field', label: 'field label'}

        const field = new Field(def)
        expect(field.label).toBeInstanceOf(Promise)

        const result = await field.label
        expect(typeof result).toBe('string')
        expect(result).toBe(def.label)
      })

      it('should get label function', async () => {
        const label = 'field label 1'
        const def: FieldDef = {
          name: 'field',
          label (...args: Array<any>) {
            expect(args.length).toBe(0)
            expect(this).toBe(field)
            return label
          }
        }

        const field = new Field(def)
        expect(await field.label).toBe(label)
      })

      it('should get label Promise', async () => {
        const label = 'field label 2'
        const def: FieldDef = {
          name: 'field',
          label: () => new Promise(resolve => resolve(label))
        }

        const field = new Field(def)
        expect(await field.label).toBe(label)
      })
    })

    describe('hint', () => {
      it('should get hint string', async () => {
        const def: FieldDef = {name: 'field', hint: 'field hint'}

        const field = new Field(def)
        expect(field.hint).toBeInstanceOf(Promise)

        const result = await field.hint
        expect(typeof result).toBe('string')
        expect(result).toBe(def.hint)
      })

      it('should get hint function', async () => {
        const hint = 'field hint 1'
        const def: FieldDef = {
          name: 'field',
          hint (...args) {
            expect(args.length).toBe(0)
            expect(this).toBe(field)
            return hint
          }
        }

        const field = new Field(def)
        expect(await field.hint).toBe(hint)
      })

      it('should get hint Promise', async () => {
        const hint = 'field hint 2'
        const def: FieldDef = {
          name: 'field',
          hint: () => new Promise(resolve => resolve(hint))
        }

        const field = new Field(def)
        expect(await field.hint).toBe(hint)
      })
    })

    describe('definition', () => {
      it('should get definition', () => {
        const def: FieldDef = {name: 'field', label: 'field label'}

        const field = new Field(def)
        expect(field.definition).toBe(def)
      })
    })

    describe('options', () => {
      it('should get options object', async () => {
        const def: FieldDef = {name: 'field', options: {param: 1}}

        const field = new Field(def)
        expect(field.options).toBeInstanceOf(Promise)

        const result = await field.options
        expect(typeof result).toBe('object')
        expect(result).toBe(def.options)
      })

      it('should get options function', async () => {
        const options = {value: 3}
        const def: FieldDef = {
          name: 'field',
          options (...args: Array<any>) {
            expect(args.length).toBe(0)
            expect(this).toBe(field)
            return options
          }
        }

        const field = new Field(def)
        expect(await field.options).toBe(options)
      })

      it('should get options Promise', async () => {
        const options = {value: 2}
        const def: FieldDef = {
          name: 'field',
          options: () => new Promise(resolve => resolve(options))
        }

        const field = new Field(def)
        expect(await field.options).toBe(options)
      })
    })

    describe('value', () => {
      const checkValue = async (data: Dictionary<any>, expectedValue: any) => {
        const field = new Field({name: 'field'}, data)
        const value = await field.value
        expect(value).toBe(expectedValue)
      }

      it('should return correct native value', async () => {
        await checkValue({field: 1}, 1)
      })

      it('should return correct value from function', async () => {
        const expectedValue = {value: 5}
        await checkValue({field: () => expectedValue}, expectedValue)
      })

      it('should return correct value from promise', async () => {
        const expectedValue = {value: 2}
        await checkValue({field: () => Promise.resolve(expectedValue)}, expectedValue)
      })
    })
  })

  /**
   * Setters
   */
  describe('setters', () => {
    describe('value', () => {
      it('should set correct value', () => {
        const fieldData = {value: 1}
        const field = new Field({name: 'field'}, fieldData)
        field.value = 5
        expect(field.data).toEqual({value: 1, field: 5})
        expect(field.data).toBe(fieldData)
      })

      it('should update correct value', () => {
        const fieldData = {value: 1, field: 3}
        const field = new Field({name: 'field'}, fieldData)
        field.value = 5
        expect(field.data).toEqual({value: 1, field: 5})
        expect(field.data).toBe(fieldData)
      })

      it('should set correct value with no data', () => {
        const field = new Field({name: 'field'})
        field.value = 2
        expect(field.data).toEqual({field: 2})
      })

      it('should set correct nested value', () => {
        const fieldData = {value: 1}
        const field = new Field({name: 'field', attributeName: 'obj.field'}, fieldData)
        field.value = 2
        expect(field.data).toEqual({value: 1, obj: {field: 2}})
        expect(field.data).toBe(fieldData)
      })
    })
  })

  describe('getOption', () => {
    it('should return simple option', async () => {
      const expectedResult = 1
      const def: FieldDef = {name: 'field', options: {test: expectedResult}}
      const field = new Field(def)
      const result = await field.getOption('test')
      expect(result).toBe(expectedResult)
    })

    it('should return option with async options', async () => {
      const expectedResult = 1
      const optionsCalled: Array<Array<any>> = []
      const def: FieldDef = {
        name: 'field',
        options: (...args: Array<any>) => {
          optionsCalled.push(args)
          return {
            test: expectedResult
          }
        }
      }
      const field = new Field(def)
      const result = await field.getOption('test')

      expect(result).toBe(expectedResult)

      expect(optionsCalled.length).toBe(1)
      expect(optionsCalled[0].length).toBe(0)
    })

    it('should return option with async option', async () => {
      const expectedResult = 1
      const expectedArgs = [{}, 5]
      const optionCalled: Array<Array<any>> = []
      const def: FieldDef = {
        name: 'field',
        options: {
          test: (...args: Array<any>) => {
            optionCalled.push(args)
            return expectedResult
          }
        }
      }
      const field = new Field(def)
      const result = await field.getOption('test', expectedArgs)

      expect(result).toBe(expectedResult)

      expect(optionCalled.length).toBe(1)
      expect(optionCalled[0].length).toBe(2)
      expect(optionCalled[0][0]).toBe(expectedArgs[0])
      expect(optionCalled[0][1]).toBe(expectedArgs[1])
    })
  })

  describe('callValueGetter', () => {
    type TypeCalled = Array<Array<any>>
    const checkCallArgs = (called: TypeCalled, expectedArg: any) => {
      expect(called.length).toBe(1)
      expect(called[0].length).toBe(1)
      expect(called[0][0]).toBe(expectedArg)
    }

    it('should call valueGetter from class', async () => {
      const called: TypeCalled = []
      const returnObj = {}

      class MockField extends Field {
        valueGetter (...args: Array<any>) {
          called.push(args)
          return returnObj
        }
      }

      const fieldData = {field: 1}
      const field = new MockField({name: 'field'})
      const result = await field.callValueGetter(fieldData)
      checkCallArgs(called, fieldData)

      expect(result).toBe(returnObj)
    })

    it('should call valueGetter from field definition', async () => {
      const classCalled: TypeCalled = []
      const classReturnObj = {}

      class MockField extends Field {
        valueGetter (...args: Array<any>) {
          classCalled.push(args)
          return classReturnObj
        }
      }

      const defCalled: TypeCalled = []
      const defReturnObj = {}
      const def: FieldDef = {
        name: 'field',
        valueGetter: (...args: Array<any>) => {
          defCalled.push(args)
          return defReturnObj
        }
      }

      const fieldData = {field: 1}
      const field = new MockField(def)
      const result = await field.callValueGetter(fieldData)
      checkCallArgs(defCalled, fieldData)
      expect(classCalled.length).toBe(0)

      expect(result).toBe(defReturnObj)
    })
  })

  describe('valueGetter', () => {
    it('should return null data', () => {
      const field = new Field({name: 'field'})
      expect(field.valueGetter(false)).toBe(null)
      expect(field.valueGetter(null)).toBe(null)
      expect(field.valueGetter(5)).toBe(null)
      expect(field.valueGetter({})).toBe(null)
      expect(field.valueGetter({field2: 1})).toBe(null)
    })

    it('should return null nested data', () => {
      const field = new Field({name: 'struct.dir.field'})
      expect(field.valueGetter(null)).toBe(null)
      expect(field.valueGetter({})).toBe(null)
      expect(field.valueGetter({field2: 1})).toBe(null)
      expect(field.valueGetter({struct: 1})).toBe(null)
      expect(field.valueGetter({struct: {dir: {}}})).toBe(null)
      expect(field.valueGetter({struct: {dir: {field2: 1}}})).toBe(null)
    })

    it('should return value', () => {
      const field = new Field({name: 'field'})
      expect(field.valueGetter({field: null})).toBe(null)
      expect(field.valueGetter({field: false})).toBe(false)
      expect(field.valueGetter({field: 1})).toBe(1)
      expect(field.valueGetter({field: 'string'})).toBe('string')
      const nestedData = {nested: 2}
      expect(field.valueGetter({field: nestedData})).toBe(nestedData)
      const valueFunc = () => 5
      expect(field.valueGetter({field: valueFunc})).toBe(valueFunc)
    })

    it('should return value nested data', () => {
      const field = new Field({name: 'struct.dir.field'})
      expect(field.valueGetter({struct: {dir: {field: null}}})).toBe(null)
      expect(field.valueGetter({struct: {dir: {field: false}}})).toBe(false)
      expect(field.valueGetter({struct: {dir: {field: 'string'}}})).toBe('string')
      expect(field.valueGetter({struct: {dir: {field: 0}}})).toBe(0)
      const nestedData = {nested: 2}
      expect(field.valueGetter({struct: {dir: {field: nestedData}}})).toBe(nestedData)
      const valueFunc = () => 5
      expect(field.valueGetter({struct: {dir: {field: valueFunc}}})).toBe(valueFunc)
    })
  })

  describe('callValueSetter', () => {
    type TypeCalled = Array<Array<any>>
    const checkCallArgs = (called: TypeCalled, expectedArgs: Array<any>) => {
      expect(called.length).toBe(1)
      expect(called[0].length).toBe(expectedArgs.length)
      expectedArgs.forEach((expectedArg, index) =>
        expect(called[0][index]).toBe(expectedArg)
      )
    }

    it('should call valueSetter from class', async () => {
      const called: TypeCalled = []
      class MockField extends Field {
        valueSetter (...args: Array<any>) {
          called.push(args)
        }
      }

      const field = new MockField({name: 'field'})
      const args = [5, {field: 1}]
      await field.callValueSetter(args[0], <Dictionary<any>> args[1])
      checkCallArgs(called, args)
    })

    it('should call valueSetter from field definition', async () => {
      const classCalled: TypeCalled = []

      class MockField extends Field {
        valueSetter (...args: any) {
          classCalled.push(args)
        }
      }

      const defCalled: TypeCalled = []
      const def: FieldDef = {
        name: 'field',
        valueSetter: (...args) => {
          defCalled.push(args)
        }
      }

      const field = new MockField(def)
      const args = [5, {field: 1}]
      await field.callValueSetter(args[0], <Dictionary<any>> args[1])
      checkCallArgs(defCalled, args)
      expect(classCalled.length).toBe(0)
    })
  })

  describe('valueSetter', () => {
    it('should set value', () => {
      const value = {value: 1}
      const field = new Field({name: 'field'})
      expect(field.data).toEqual({})
      field.valueSetter(value, field.data)
      expect(field.data).toEqual({field: value})
      expect(field.data.field).toBe(value)

      const newValue = {value: 2}
      field.valueSetter(newValue, field.data)
      expect(field.data).toEqual({field: newValue})
      expect(field.data.field).toBe(newValue)
    })

    it('should set value nested attribute', () => {
      const value = {value: 1}
      const field = new Field({name: 'field', attributeName: 'nested.obj.field'})
      expect(field.data).toEqual({})
      field.valueSetter(value, field.data)
      expect(field.data).toEqual({nested: {obj: {field: value}}})
      expect(field.data.nested.obj.field).toBe(value)
    })

    it('should set value update nested attribute', () => {
      const value = {value: 1}
      const fieldData = {nested: {value: 2}, value: 3}
      const field = new Field({name: 'field', attributeName: 'nested.obj.field'}, fieldData)
      field.valueSetter(value, field.data)
      expect(field.data).toEqual({nested: {value: 2, obj: {field: value}}, value: 3})
      expect(field.data.nested.obj.field).toBe(value)
    })

    it('should set value update nested attribute null', () => {
      const value = {value: 1}
      const fieldData = {nested: {obj: null}}
      const field = new Field({name: 'field', attributeName: 'nested.obj.field'}, fieldData)
      field.valueSetter(value, field.data)
      expect(field.data).toEqual({nested: {obj: {field: value}}})
      expect(field.data.nested.obj.field).toBe(value)
    })

    it('should set value update nested only attribute', () => {
      const value = {value: 1}
      const fieldData = {nested: {obj: {field: {value: 2}}}}
      const field = new Field({name: 'field', attributeName: 'nested.obj.field'}, fieldData)
      field.valueSetter(value, field.data)
      expect(field.data).toEqual({nested: {obj: {field: value}}})
      expect(field.data.nested.obj.field).toBe(value)
    })
  })
})
