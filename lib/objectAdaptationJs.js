const isPlainObject = require('is-plain-object')
const assertObjectShape = require('assert-object-shape')
const keyExchange = require('./keyExchange.js')

function createShapeMutation(keys = [], callback) {
  if (!callback) {
    throw new Error('A callback is required to create a shape mutation.')
  }
  return (payload = {}) => {
    const payloadEntries = Object.entries(payload)
    return payloadEntries.reduce(
      (mutatedPayload, [payloadKey, payloadValue]) => {
        if (!keys.includes(payloadKey)) {
          return { ...mutatedPayload, [payloadKey]: payloadValue }
        }
        const mutation = callback(payloadKey, payloadValue, mutatedPayload)
        if (!isPlainObject(mutation)) return { ...mutatedPayload }
        return { ...mutatedPayload, ...mutation }
      },
      {}
    )
  }
}

function createShapeConfig(shape, options = {}) {
  if (!isPlainObject(shape)) {
    throw new Error('A plain object shape is required to create shape config.')
  }
  const { mutations = [] } = options
  return { shape, mutations }
}

function adaptToShape(payload, config = {}) {
  assertObjectShape(config, ['shape'])
  const { shape, mutations = [] } = config
  const shapeKeys = Object.keys(shape)
  const payloadEntries = Object.entries(payload)
  const reducedPayload = payloadEntries.reduce(
    (reducedPayload, [payloadKey, payloadValue]) => {
      if (shapeKeys.includes(payloadKey)) {
        return { ...reducedPayload, [payloadKey]: payloadValue }
      }
      return reducedPayload
    },
    {}
  )
  let mutatedPayload = keyExchange(reducedPayload, shape)
  if (Array.isArray(mutations) && mutations.length > 0) {
    mutatedPayload = mutations.reduce((mutadedPayload, mutation) => {
      return mutation(mutadedPayload)
    }, mutatedPayload)
  }
  return { ...mutatedPayload }
}

module.exports = {
  createShapeMutation,
  createShapeConfig,
  adaptToShape
}
