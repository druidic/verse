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

describe('has', () => {
  it('returns true if the object has the property', () => {
    expect(has('a', {a: 1})).toBe(true)
  })

  it('returns false if not', () => {
    expect(has('a', {})).toBe(false)
  })

  it('sees properties that have no value', () => {
    expect(has('a', {a: undefined})).toBe(true)
  })

  it('ignores inherited properties', () => {
    let parent = {a: 1}
    let child = Object.create(parent)
    expect(has('a', child)).toBe(false)
  })

  it('autocurries', () => {
    expect(has('a')({a: 1})).toBe(true)
  })
})

describe('not', () => {
  it('inverts a predicate', () => {
    expect(not(isTruthy)(false)).toBe(true)
  })

  it('takes its name from the predicate', () => {
    expect(not(isTruthy).name).toBe('not(isTruthy)')
  })
})

describe('or', () => {
  let aOrB = or(has('a'), has('b'))

  it('returns true when the first predicate applies', () => {
    expect(aOrB({a: 1})).toBe(true)
  })

  it('returns true when the second predicate applies', () => {
    expect(aOrB({b: 1})).toBe(true)
  })

  it('returns false when neither predicate applies', () => {
    expect(aOrB({})).toBe(false)
  })

  it('returns true when both predicates apply', () => {
    expect(aOrB({a: 1, b: 1})).toBe(true)
  })

  it('takes its name from the predicates', () => {
    expect(aOrB.name).toBe('or(has(a), has(b))')
  })
})

describe('isEmpty', () => {
  it('returns true for an empty array', () => {
    expect(isEmpty([])).toBe(true)
  })

  it('returns true for an empty Set', () => {
    expect(isEmpty(new Set())).toBe(true)
  })

  it('returns false for an array with one item', () => {
    expect(isEmpty([1])).toBe(false)
  })

  it('returns false for a Set with one item', () => {
    expect(isEmpty(new Set([1]))).toBe(false)
  })
})

describe('isObject', () => {
  it('returns true for an [object Object]', () => {
    expect(isObject({})).toBe(true)
  })

  it('returns false for an array', () => {
    expect(isObject([])).toBe(false)
  })

  it('returns false for null', () => {
    expect(isObject(null)).toBe(false)
  })

  it('returns false for a regex', () => {
    expect(isObject(/a/)).toBe(false)
  })
})
