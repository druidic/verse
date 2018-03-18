// leading underscore prevents conflict with Jasmine's expect()
function _expect(subject, predicate, ...params) {
  if (!predicate) throw 'expect() requires a function as the second argument'
  if (!predicate(...params, subject)) {
    throw {subject, predicate, params}
  }
}

function runTests(tests) {
  let failures = tests
    .map(getFailure)
    .filter(isTruthy)

  return {failures, totalTestsRun: tests.length}

  function getFailure(test) {
    try {
      test()
    } catch (failure) {
      return failure
    }
    return null
  }
}

function getTestFunctions(global) {
  return Object.values(global)
    .filter(has('name'))
    .filter(({name}) => startsWith('test_', name))
}
