const isPlainObject = require('is-plain-object')
const assertObjectShape = require('assert-object-shape')

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

function createShapeConfiguration(shapeKeys, options = {}) {
  const isArray = value => Array.isArray(value)
  const isArrayOfStrings = (array = []) => {
    return array.every(arrayItem => typeof arrayItem === 'string')
  }
  if (!isArray(shapeKeys) || !isArrayOfStrings(shapeKeys)) {
    throw new Error(
      'An array of string keys is required to create a shape configuration.'
    )
  }
  const { mutationCallbacks = [] } = options
  return { shapeKeys, mutationCallbacks }
}

function adaptToShape(payload, configuration = {}) {
  assertObjectShape(configuration, ['shapeKeys'])
  const { shapeKeys, mutationCallbacks = [] } = configuration
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
  let mutatedPayload = reducedPayload
  if (Array.isArray(mutationCallbacks) && mutationCallbacks.length > 0) {
    mutatedPayload = mutationCallbacks.reduce(
      (mutadedPayload, mutationCallback) => {
        return mutationCallback(mutadedPayload)
      },
      mutatedPayload
    )
  }
  return { ...mutatedPayload }
}

module.exports = {
  createShapeMutation,
  createShapeConfiguration,
  adaptToShape,
}
