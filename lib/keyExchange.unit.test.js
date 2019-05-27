const keyExchange = require('./keyExchange.js')

describe('key exchange', () => {
  const payload = {
    id: 1,
    name: 'Example T-Shirt',
    variants: [
      {
        id: 2365419,
        name: 'S',
        inventory_quantity: null,
        price: {
          value: 49,
          value_type: 'USD'
        }
      }
    ]
  }

  const reference = {
    id: 'foreign_id',
    name: 'title',
    inventory_quantity: 'stock',
    value: 'amount',
    value_type: 'currency'
  }

  test('successful exchange', () => {
    expect.assertions(1)
    expect(keyExchange(payload, reference)).toMatchObject({
      foreign_id: 1,
      title: 'Example T-Shirt',
      variants: [
        {
          foreign_id: 2365419,
          title: 'S',
          stock: null,
          price: {
            amount: 49,
            currency: 'USD'
          }
        }
      ]
    })
  })
})
