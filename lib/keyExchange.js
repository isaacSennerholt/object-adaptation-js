const isPlainObject = require('is-plain-object')

function keyExchange(object, reference) {
  const objectEntries = Object.entries(object)
  return objectEntries.reduce((latestObject, [key, value]) => {
    const newKey = reference[key] || key

    if (isPlainObject(value)) {
      const updatedValue = keyExchange(value, reference)
      return { ...latestObject, [newKey]: updatedValue }
    }

    if (Array.isArray(value)) {
      const updatedValue = value.map(item => {
        if (isPlainObject(item)) return keyExchange(item, reference)
        return item
      })
      return { ...latestObject, [newKey]: updatedValue }
    }

    return { ...latestObject, [newKey]: value }
  }, {})
}

module.exports = keyExchange
