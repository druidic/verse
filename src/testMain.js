function test(fn) {
  test.tests = test.tests || []
  test.tests.push(fn)
}

function truthy(a) { return !!a }

function testMain() {
  let tests = test.tests || []
  let failures = tests
    .map(thrownException)
    .filter(truthy)

  if (failures.length) {
    console.log(failures.length + ' tests failed')
    failures.forEach(f => console.log(f))
  } else {
    console.log('All ' + tests.length + ' tests passed.')
  }
}

function thrownException(fn) {
  try {
    fn()
    return null
  } catch (e) {
    return e
  }
}

testMain()

