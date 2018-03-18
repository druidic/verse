function isTruthy(a) {
  return !!a
}

function isExactly(a, b) {
  return a === b
}

function has(prop, obj) {
  if (arguments.length < 2) return partialApply(has, arguments)
  return Object.prototype.hasOwnProperty.call(obj, prop)
}

function isIn(obj, prop) {
  if (arguments.length < 2) return partialApply(isIn, arguments)
  return Object.prototype.hasOwnProperty.call(obj, prop)
}

function startsWith(prefix, s) {
  return s.indexOf(prefix) === 0
}

function not(predicate) {
  let name = 'not(' + predicate.name + ')'
  return {[name]: (...args) => !predicate(...args)}[name]
}

function isEmpty(a) {
  for (let item of a) return false
  return true
}

function isString(a) {
  return typeof a === 'string'
}

function isNumber(a) {
  return a === +a
}

function isObject(a) {
  return Object.prototype.toString.call(a) === '[object Object]'
}
