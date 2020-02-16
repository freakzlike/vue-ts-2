import {BaseModel} from '@/models/BaseModel'
import {Field} from '@/models/Field'

describe('models/BaseModel.js', () => {
  describe('constructor', () => {
    it('should create BaseModel with data', () => {
      const spy = jest.spyOn(console, 'warn').mockImplementation()

      class TestModel extends BaseModel {
        public static keyName = 'TestModel'
      }

      TestModel.register()

      const data = {a: 1}
      const model = new TestModel(data)
      expect(model).toBeInstanceOf(BaseModel)

      expect(console.warn).toHaveBeenCalledTimes(0)

      expect(model.data).toBe(data)
      spy.mockRestore()
    })

    it('should create BaseModel with default data', () => {
      const spy = jest.spyOn(console, 'warn').mockImplementation()

      class TestModel extends BaseModel {
        public static keyName = 'TestModel'
      }

      TestModel.register()

      const model = new TestModel()
      expect(model).toBeInstanceOf(BaseModel)

      expect(console.warn).toHaveBeenCalledTimes(0)

      expect(model.data).toEqual({})
      spy.mockRestore()
    })

    it('should create BaseModel with warning for missing settings', () => {
      const spy = jest.spyOn(console, 'warn').mockImplementation()

      class TestModel extends BaseModel {
      }

      const data = {a: 1}
      const model = new TestModel(data)
      expect(model).toBeInstanceOf(BaseModel)

      expect(console.warn).toHaveBeenCalledTimes(2)
      expect(spy.mock.calls).toEqual([
        ['Missing keyName for Model', 'TestModel'],
        ['Model is not registered', 'TestModel']
      ])

      spy.mockRestore()
    })

    it('should create BaseModel and bind fields', () => {
      const testField = new Field()
      expect(testField.name).toBeNull()

      class Field1 extends Field {
      }

      class TestModel extends BaseModel {
        public static keyName = 'TestModel'
        protected static fieldsDef = {
          name: testField,
          description: testField,
          field1: new Field1()
        }
      }

      TestModel.register()

      const model = new TestModel()

      expect(testField.name).toBeNull()

      const fields = model.fields
      expect(fields).not.toBeNull()
      expect(Object.keys(fields).sort()).toEqual(['name', 'description', 'field1'].sort())

      Object.keys(fields).forEach(fieldName => {
        const field = fields[fieldName]
        expect(field).not.toBe(testField)
        expect(field.name).toBe(fieldName)
        expect(field).toBeInstanceOf(Field)
        if (fieldName === 'field1') {
          expect(field).toBeInstanceOf(Field1)
        } else {
          expect(field).not.toBeInstanceOf(Field1)
        }
      })
    })
  })

  describe('register', () => {
    it('should register only once', () => {
      class TestModel extends BaseModel {
        public static keyName = 'TestModel'
      }

      expect(TestModel.register()).toBe(true)
      expect(TestModel.register()).toBe(false)
    })
  })

  describe('val', () => {
    it('should return correct values', () => {
      const data = {
        name: 'Name',
        obj: {a: 1}
      }

      class TestModel extends BaseModel {
        public static keyName = 'TestModel'
        protected static fieldsDef = {
          name: new Field(),
          obj: new Field(),
          description: new Field()
        }
      }

      TestModel.register()
      const model = new TestModel(data)
      expect(model.val.name).toBe(data.name)
      expect(model.val.obj).toBe(data.obj)
      expect(model.val.description).toBeUndefined()
      expect(model.val.no_field).toBeUndefined()
    })
  })
})
