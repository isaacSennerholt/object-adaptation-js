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
          const outcome = { price: 0, currency: undefined }
          return variants.reduce((outcome, variant) => {
            const { price: mutationPrice, currency: mutationCurrency } = outcome
            const { price: variantPrice, currency: variantCurrency } = variant
            if (!mutationCurrency) {
              outcome.currency = variantCurrency
            }
            if (parseInt(variantPrice, 10) > parseInt(mutationPrice, 10)) {
              outcome.price = variantPrice
            }
            return outcome
          }, outcome)
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
      const expectedResult = { shapeKeys, mutations: [] }
      expect.assertions(1)
      expect(createShapeConfiguration(shapeKeys)).toEqual(expectedResult)
    })
  })

  describe('adapt to shape', () => {
    test('successful adaptation', () => {
      const payload = {
        id: 1,
        title: 'Roundneck t-shirt',
        variants: [
          { id: 1, price: '10.00', currency: 'USD', color: 'blue' },
          { id: 1, price: '4.00', currency: 'USD', color: 'red' },
        ],
      }
      const shapeKeys = ['id', 'variants']
      const foreignIdMutation = payload => {
        const { id } = payload
        return { ...payload, foreign_id: id }
      }
      const configuration = { shapeKeys, mutations: [foreignIdMutation] }
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
