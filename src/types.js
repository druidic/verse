function defaultingTo(defaultValue, predicate) {
  if (defaultValue === undefined) throw 'Type must have a default value'
  if (!predicate(defaultValue)) throw 'Given default value does not satisfy the type'

  let theType = (...args) => predicate(...args)

  theType.defaultValue = defaultValue
  return theType
}

function oneOf(...values) {
  _expect(values, not(isEmpty))
  let theType = v => values.includes(v)
  theType.defaultValue = values[0]
  return theType
}

function mapObject(fn, obj) {
  let result = {}
  for (let key of Object.keys(obj)) {
    result[key] = fn(obj[key])
  }
  return result
}

function objectsHaveSameKeys(a, b) {
  let aKeys = Object.keys(a)
  let bKeys = Object.keys(b)
  return aKeys.length === bKeys.length && bKeys.every(isIn(a))
}

function satisfies(type, value) {
  if (arguments.length < 2) return partialApply(satisfies, arguments)
  if (value && value._verse_type) return value._verse_type === type
  if (typeof type === 'function') return type(value)
  _expect(type, isObject)
  if (!isObject(value)) return false
  if (!objectsHaveSameKeys(type, value)) return false
  for (let key of Object.keys(type)) {
    if (!satisfies(type[key], value[key])) return false
  }
  Object.defineProperty(value, '_verse_type', {value: type})
  return true
}

function getDefaultValue(type) {
  if (isObject(type)) return mapObject(getDefaultValue, type)
  if (has('defaultValue', type)) return type.defaultValue

  let likelyDefaults = [null, [], 0, '']
  let value = likelyDefaults.find(type)
  if (value === undefined) throw 'No default value for type'
  return value
}

function isArrayOf(type) {
  return a => Array.isArray(a) && a.every(satisfies(type))
}

function isNullOr(type) {
  return a => a === null || satisfies(type, a)
}
