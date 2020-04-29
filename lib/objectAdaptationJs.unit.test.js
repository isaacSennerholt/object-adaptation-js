const {
  createShapeMutation,
  createShapeConfiguration,
  adaptToShape,
} = require('./objectAdaptationJs.js')

describe('object adaptation', () => {
  describe('create shape mutation', () => {
    test('successful creation', () => {
      const payload = {
        variants: [
          { id: 1, price: '10.00', currency: 'USD', color: 'blue' },
          { id: 1, price: '4.00', currency: 'USD', color: 'red' },
        ],
      }
      const variantMutation = createShapeMutation(
        ['variants'],
        (_, variants) => {
          const mutation = { price: 0, currency: undefined }
          return variants.reduce((mutation, variant) => {
            const {
              price: mutationPrice,
              currency: mutationCurrency,
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
        currency: 'USD',
      }
      expect.assertions(1)
      expect(variantMutation(payload)).toEqual(expectedResult)
    })
  })

  describe('create shape configuration', () => {
    test('invalid shape keys', () => {
      expect.assertions(1)
      expect(() => createShapeConfiguration(null)).toThrow()
    })

    test('successful creation', () => {
      const shapeKeys = ['id', 'title']
      const expectedResult = { shapeKeys, mutationCallbacks: [] }
      expect.assertions(1)
      expect(createShapeConfiguration(shapeKeys)).toEqual(expectedResult)
    })
  })

  describe('adapt to shape', () => {
    test('invalid shape keys', () => {
      const payload = {
        id: 1,
        title: 'Roundneck t-shirt',
        variants: [
          { id: 1, price: '10.00', currency: 'USD', color: 'blue' },
          { id: 1, price: '4.00', currency: 'USD', color: 'red' },
        ],
      }
      const configuration = { mutationCallbacks: [] }
      expect.assertions(1)
      expect(() => adaptToShape(payload, configuration)).toThrow()
    })

    test('successful creation', () => {
      const payload = {
        id: 1,
        title: 'Roundneck t-shirt',
        variants: [
          { id: 1, price: '10.00', currency: 'USD', color: 'blue' },
          { id: 1, price: '4.00', currency: 'USD', color: 'red' },
        ],
      }
      const shapeKeys = ['id', 'variants']
      const mutationCallback = payload => {
        const { id } = payload
        return { ...payload, foreign_id: id }
      }
      const configuration = { shapeKeys, mutationCallbacks: [mutationCallback] }
      const expectedResult = {
        id: 1,
        variants: [
          { id: 1, price: '10.00', currency: 'USD', color: 'blue' },
          { id: 1, price: '4.00', currency: 'USD', color: 'red' },
        ],
        foreign_id: 1,
      }
      expect.assertions(1)
      expect(adaptToShape(payload, configuration)).toEqual(expectedResult)
    })
  })
})
