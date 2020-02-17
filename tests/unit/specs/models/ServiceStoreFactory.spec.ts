import store from '@/store'
import {Dictionary} from '@/types/Dictionary'
import {ServiceStore, ServiceStoreFactory, ServiceStoreOptions} from '@/models/ServiceStoreFactory'

describe('models/ServiceStoreFactory.js', () => {
  const registerModule = (module: ServiceStore): string => {
    const moduleName = 'unitTest' + Math.random().toString(36).substring(2)
    store.registerModule(moduleName, module)
    return moduleName
  }

  const unregisterModule = (moduleName: string): void => {
    store.unregisterModule(moduleName)
  }

  const mockGetTime = (RealDate: typeof Date, time: number) => {
    // @ts-ignore
    global.Date = class extends RealDate {
      // noinspection JSUnusedGlobalSymbols
      getTime () {
        return time
      }
    }
  }

  describe('factory', () => {
    it('should return serviceStore', () => {
      const serviceStore = ServiceStoreFactory(5)
      expect(serviceStore).toBeTruthy()
      expect(serviceStore).toHaveProperty('state')
      expect(serviceStore).toHaveProperty('actions')
      expect(serviceStore).toHaveProperty('mutations')

      const moduleName = registerModule(serviceStore)

      expect(store.state).toHaveProperty(moduleName)
      const state: Dictionary<Dictionary<any>> = store.state
      expect(state[moduleName].cacheDuration).toBe(5)

      unregisterModule(moduleName)
    })
  })

  describe('getData', () => {
    it('should request data and use cache', async () => {
      const moduleName = registerModule(ServiceStoreFactory(null))
      const resultData = {x: 1}
      const options: ServiceStoreOptions = {
        key: 'serviceKey',
        sendRequest: () => Promise.resolve(resultData)
      }
      const spySendRequest = jest.spyOn(options, 'sendRequest')

      expect(await store.dispatch(moduleName + '/getData', options)).toBe(resultData)
      expect(spySendRequest).toBeCalledTimes(1)

      expect(await store.dispatch(moduleName + '/getData', options)).toBe(resultData)
      expect(spySendRequest).toBeCalledTimes(1)

      const state: Dictionary<Dictionary<any>> = store.state
      expect(state[moduleName]._data).toHaveProperty(options.key)

      spySendRequest.mockRestore()
      unregisterModule(moduleName)
    })

    it('should request data and not use cache', async () => {
      const moduleName = registerModule(ServiceStoreFactory(0))
      const resultData = {x: 1}
      const options: ServiceStoreOptions = {
        key: 'serviceKey',
        sendRequest: () => Promise.resolve(resultData)
      }
      const spySendRequest = jest.spyOn(options, 'sendRequest')

      expect(await store.dispatch(moduleName + '/getData', options)).toBe(resultData)
      expect(spySendRequest).toBeCalledTimes(1)

      expect(await store.dispatch(moduleName + '/getData', options)).toBe(resultData)
      expect(spySendRequest).toBeCalledTimes(2)

      spySendRequest.mockRestore()
      unregisterModule(moduleName)
    })

    it('should request data and use expiring cache', async () => {
      const moduleName = registerModule(ServiceStoreFactory(5))
      const resultData = {x: 1}
      const options: ServiceStoreOptions = {
        key: 'serviceKey',
        sendRequest: () => Promise.resolve(resultData)
      }
      const spySendRequest = jest.spyOn(options, 'sendRequest')

      expect(await store.dispatch(moduleName + '/getData', options)).toBe(resultData)
      expect(spySendRequest).toBeCalledTimes(1)

      expect(await store.dispatch(moduleName + '/getData', options)).toBe(resultData)
      expect(spySendRequest).toBeCalledTimes(1)

      spySendRequest.mockRestore()
      unregisterModule(moduleName)
    })

    it('should attach to running request', async () => {
      jest.useFakeTimers()
      const moduleName = registerModule(ServiceStoreFactory(0))
      const resultData = {x: 1}
      const options: ServiceStoreOptions = {
        key: 'serviceKey',
        sendRequest: () => new Promise(resolve => {
          setTimeout(() => resolve(resultData), 50000)
        })
      }
      const spySendRequest = jest.spyOn(options, 'sendRequest')

      const promise1 = store.dispatch(moduleName + '/getData', options)
      expect(promise1).toBeInstanceOf(Promise)
      expect(spySendRequest).toBeCalledTimes(1)
      const promise2 = store.dispatch(moduleName + '/getData', options)
      expect(promise2).toBeInstanceOf(Promise)
      expect(spySendRequest).toBeCalledTimes(1)

      expect(store.state).toHaveProperty(moduleName)
      const state: Dictionary<Dictionary<any>> = store.state
      expect(state[moduleName]._data).not.toHaveProperty(options.key)
      expect(state[moduleName]._requests).toHaveProperty(options.key)

      jest.runOnlyPendingTimers()

      expect(await promise1).toBe(resultData)
      expect(await promise2).toBe(resultData)

      spySendRequest.mockRestore()
      unregisterModule(moduleName)
    })

    it('should expire cache and request data', async () => {
      const moduleName = registerModule(ServiceStoreFactory(10))
      const resultData = {x: 1}
      const options: ServiceStoreOptions = {
        key: 'serviceKey',
        sendRequest: () => Promise.resolve(resultData)
      }
      const spySendRequest = jest.spyOn(options, 'sendRequest')
      const RealDate = Date

      mockGetTime(RealDate, 1000)

      expect(await store.dispatch(moduleName + '/getData', options)).toBe(resultData)
      expect(spySendRequest).toBeCalledTimes(1)

      expect(await store.dispatch(moduleName + '/getData', options)).toBe(resultData)
      expect(spySendRequest).toBeCalledTimes(1)

      mockGetTime(RealDate, 12000)

      expect(await store.dispatch(moduleName + '/getData', options)).toBe(resultData)
      expect(spySendRequest).toBeCalledTimes(2)

      spySendRequest.mockRestore()
      unregisterModule(moduleName)
      // @ts-ignore
      global.Date = RealDate
    })
  })

  describe('clean', () => {
    it('should clean expired keys', async () => {
      const moduleName = registerModule(ServiceStoreFactory(10))
      const sendRequest = () => Promise.resolve(0)

      const RealDate = Date

      mockGetTime(RealDate, 1000)

      await store.dispatch(moduleName + '/getData', {key: 'key1', sendRequest})
      await store.dispatch(moduleName + '/getData', {key: 'key2', sendRequest})

      mockGetTime(RealDate, 9000)
      await store.dispatch(moduleName + '/getData', {key: 'key3', sendRequest})

      mockGetTime(RealDate, 12000)

      const state: Dictionary<Dictionary<any>> = store.state
      const stateData: Dictionary<any> = state[moduleName]._data
      expect(Object.keys(stateData)).toHaveLength(3)
      expect(Object.keys(stateData).sort()).toEqual(['key1', 'key2', 'key3'].sort())

      store.commit(moduleName + '/clean')

      expect(Object.keys(stateData)).toHaveLength(1)
      expect(Object.keys(stateData)).toEqual(['key3'])

      unregisterModule(moduleName)
      // @ts-ignore
      global.Date = RealDate
    })
  })
})
