function keyExchange(object, reference) {
  const objectEntries = Object.entries(object)
  return objectEntries.reduce((latestObject, [key, value]) => {
    const newKey = reference[key] || key
    return { ...latestObject, [newKey]: value }
  }, {})
}

module.exports = keyExchange
