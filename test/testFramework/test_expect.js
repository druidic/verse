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
      params: []
    })
  })

  it('makes a passing assertion with an expected value', () => {
    expect(() => _expect(1, isExactly, 1)).not.toThrow()
  })

  it('makes a failing assertion with an expected value', () => {
    expect(() => _expect(1, isExactly, 2)).toThrow({
      subject: 1,
      predicate: isExactly,
      params: [2]
    })
  })
})
