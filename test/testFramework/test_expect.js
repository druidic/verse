describe('expect', () => {
  it('throws given no arguments', () => {
    expect(_expect).toThrow('expect() requires a function as the second argument')
  })

  it('throws given a subject but no predicate', () => {
    expect(() => _expect(1)).toThrow()
  })

  it('makes a passing assertion', () => {
    expect(() => _expect(1, isTruthy)).not.toThrow()
  })

  it('throws on a failed assertion', () => {
    expect(() => _expect(0, isTruthy)).toThrow({
      subject: 0,
      predicate: isTruthy,
      params: [],
      toString: jasmine.anything()
    })
  })

  it('makes a passing assertion with an expected value', () => {
    expect(() => _expect(1, isExactly, 1)).not.toThrow()
  })

  it('makes a failing assertion with an expected value', () => {
    expect(() => _expect(1, isExactly, 2)).toThrow({
      subject: 1,
      predicate: isExactly,
      params: [2],
      toString: jasmine.anything()
    })
  })

  it('formats a human-readable description of the failure', () => {
    let caught
    try {
      _expect(1, isExactly, 2)
    } catch (e) {
      caught = e
    }
    expect('' + caught).toBe(`Check failed!
Expected that
  1
isExactly
  2`)
  })

  it('assumes a curryable argument order for predicates', () => {
    expect(() => _expect({a: 1}, has, 'a')).not.toThrow()
    expect(() => _expect('hello', startsWith, 'hell')).not.toThrow()
  })
})
