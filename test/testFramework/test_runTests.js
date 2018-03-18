describe('runTests', function() {
  it('reports when no tests run', () => {
    expect(runTests([])).toEqual({
      totalTestsRun: 0,
      failures: []
    })
  })

  it('reports a passing test', () => {
    let pass = () => {}
    expect(runTests([pass])).toEqual({
      totalTestsRun: 1,
      failures: []
    })
  })

  it('reports a failing test', () => {
    let fail = () => { throw 'dummy' }
    expect(runTests([fail])).toEqual({
      totalTestsRun: 1,
      failures: ['dummy']
    })
  })

  it('reports a passing test after a failing test', () => {
    let pass = () => {}
    let fail = () => { throw 'dummy' }
    expect(runTests([fail, pass])).toEqual({
      totalTestsRun: 2,
      failures: ['dummy']
    })
  })

  it('reports multiple failures', () => {
    let fail1 = () => { throw 1 }
    let fail2 = () => { throw 2 }
    expect(runTests([fail1, fail2])).toEqual({
      totalTestsRun: 2,
      failures: [1, 2]
    })
  })
})
