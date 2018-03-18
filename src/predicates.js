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

function startsWith(prefix, s) {
  return s.indexOf(prefix) === 0
}
