// leading underscore prevents conflict with Jasmine's expect()
function _expect(subject, predicate, ...params) {
  if (!predicate) throw 'expect() requires a function as the second argument'
  if (!predicate(subject, ...params)) {
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
