const {
  createShapeMutation,
  createShapeConfig,
  adaptToShape
} = require('./objectAdaptationJs.js')

describe('object adaptation', () => {
  describe('create shape mutation', () => {
    test('invalid callback return value', () => {
      const payload = {
        variants: [
          { id: 1, price: '10.00', currency: 'USD', color: 'blue' },
          { id: 1, price: '4.00', currency: 'USD', color: 'red' }
        ]
      }
      const variantMutation = createShapeMutation(
        ['variants'],
        (_, variants) => {
          return ['Callback fails to return a plain object..']
        }
      )
      expect.assertions(1)
      expect(() => variantMutation(payload)).toThrow()
    })

    test('successful creation', () => {
      const payload = {
        variants: [
          { id: 1, price: '10.00', currency: 'USD', color: 'blue' },
          { id: 1, price: '4.00', currency: 'USD', color: 'red' }
        ]
      }
      const variantMutation = createShapeMutation(
        ['variants'],
        (_, variants) => {
          const mutation = { price: 0, currency: undefined }
          return variants.reduce((mutation, variant) => {
            const {
              price: mutationPrice,
              currency: mutationCurrency
            } = mutation
            const { price: variantPrice, currency: variantCurrency } = variant
            if (!mutationCurrency) {
              mutation.currency = variantCurrency
            }
            if (parseInt(variantPrice, 10) > parseInt(mutationPrice, 10)) {
              mutation.price = variantPrice
            }
            return mutation
          }, mutation)
        }
      )
      const expectedResult = {
        price: '10.00',
        currency: 'USD'
      }
      expect.assertions(1)
      expect(variantMutation(payload)).toEqual(expectedResult)
    })
  })

  describe('create shape configuration', () => {
    test('invalid shape', () => {
      expect.assertions(1)
      expect(() => createShapeConfig(null)).toThrow()
    })

    test('successful creation', () => {
      const shape = {
        id: 'foreign_id',
        title: 'name'
      }
      const expectedResult = { shape, mutations: [] }
      expect.assertions(1)
      expect(createShapeConfig(shape)).toEqual(expectedResult)
    })
  })
})
