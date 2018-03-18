describe('isTruthy', () => {
  it('returns false for falsey values', () => {
    expect(isTruthy(0))        .toBe(false)
    expect(isTruthy(''))       .toBe(false)
    expect(isTruthy(null))     .toBe(false)
    expect(isTruthy(undefined)).toBe(false)
    expect(isTruthy(false))    .toBe(false)
  })

  it('returns true for everything else', () => {
    expect(isTruthy(1))   .toBe(true)
    expect(isTruthy('a')) .toBe(true)
    expect(isTruthy([]))  .toBe(true)
    expect(isTruthy({}))  .toBe(true)
    expect(isTruthy(true)).toBe(true)
  })
})

describe('isExactly', () => {
  it('compares primitives by value', () => {
    expect(isExactly('', ''))   .toBe(true)
    expect(isExactly('a', 'a')) .toBe(true)
    expect(isExactly('a', ''))  .toBe(false)
    expect(isExactly(1, 1))     .toBe(true)
    expect(isExactly(0, 1))     .toBe(false)
  })

  it('compares objects by identity', () => {
    let a = {}
    let b = {}
    expect(isExactly(a, b)).toBe(false)
    expect(isExactly(a, a)).toBe(true)
  })
})
