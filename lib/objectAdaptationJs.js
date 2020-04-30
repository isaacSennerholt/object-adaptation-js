const isPlainObject = require('is-plain-object')

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
        const outcome = callback(payloadKey, payloadValue, mutatedPayload)
        if (!isPlainObject(outcome)) return { ...mutatedPayload }
        return { ...mutatedPayload, ...outcome }
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
  const { mutations = [] } = options
  return { shapeKeys, mutations }
}

function adaptToShape(payload = {}, configuration = {}) {
  const { shapeKeys = [], mutations = [] } = configuration
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
  if (Array.isArray(mutations) && mutations.length > 0) {
    mutatedPayload = mutations.reduce((mutadedPayload, mutation) => {
      return mutation(mutadedPayload)
    }, mutatedPayload)
  }
  return { ...mutatedPayload }
}

module.exports = {
  createShapeMutation,
  createShapeConfiguration,
  adaptToShape,
}
