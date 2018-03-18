

function isObject(a) {
  return Object.prototype.toString.call(a) === '[object Object]'
}

describe('a type', () => {
  it('is a predicate and a default value that satisfies it', () => {
    let stringType = defaultingTo('a', isString)
    expect(getDefaultValue(stringType)).toBe('a')
  })

  it('errors if the default value does not satisfy the predicate', () => {
    expect(() => defaultingTo(1, isString)).toThrow()
  })

  it('will guess at a default value given just a predicate', () => {
    expect(getDefaultValue(isString)).toBe('')
    expect(getDefaultValue(isNullOr(isString))).toBe(null)
    expect(getDefaultValue(isArrayOf(isString))).toEqual([])
  })

  it('generates a default value for a product type', () => {
    let t = {
      a: isString,
      b: isNumber
    }
    expect(getDefaultValue(t)).toEqual({a: '', b: 0})
  })

  it('uses the first value as the default for a sum type', () => {
    let t = oneOf('foo', 'bar')
    expect(getDefaultValue(t)).toBe('foo')
  })

  it('typechecks a primitive value', () => {
    let type = defaultingTo('a', isString)
    expect(type('abc')).toBe(true)
    expect(type(0))    .toBe(false)
  })

  it('typechecks an array', () => {
    let type = isArrayOf(isNumber)
    expect(satisfies(type, []))      .toBe(true)
    expect(satisfies(type, {}))      .toBe(false)
    expect(satisfies(type, ['1']))   .toBe(false)
    expect(satisfies(type, [1]))     .toBe(true)
    expect(satisfies(type, [1, '2'])).toBe(false)
  })

  it('typechecks a product type', () => {
    let type = {
      foo: isString,
      bar: isNumber
    }
    let ok = {foo: '', bar: 0}
    expect(satisfies(type, ok))              .toBe(true)
    expect(satisfies(type, {...ok, bar: ''})).toBe(false)
    expect(satisfies(type, {...ok, qux: 0})) .toBe(false)
  })

  it('typechecks the same value multiple times', () => {
    let type = {
      foo: isString,
      bar: isNumber
    }
    let ok = {foo: '', bar: 0}
    expect(satisfies(type, ok)).toBe(true)
  })

  it('typechecks a sum type', () => {
    let type = oneOf('a', 'b')
    expect(satisfies(type, 'a')).toBe(true)
    expect(satisfies(type, 'b')).toBe(true)
    expect(satisfies(type, 'c')).toBe(false)
  })

  it('typechecks a nullable type', () => {
    let type = isNullOr({foo: isString})
    expect(satisfies(type, null)).toBe(true)
    expect(satisfies(type, undefined)).toBe(false)
    expect(satisfies(type, {foo: 'a'})).toBe(true)
  })

  it('checks composite types', () => {
    let user = {name: isString, age: isNumber}
    let arrayOfUsers = isArrayOf(user)
    let e = oneOf('a', 'b')
    let composite = {
      users: arrayOfUsers,
      option: e
    }

    let good = {
      users: [{name: 'foo', age: 1}, {name: 'bar', age: 2}],
      option: 'a'
    }

    let badUser = {
      users: [{name: 'foo', age: 1}, {name: 'bar'}],
      option: 'b'
    }

    let badOpt = {
      users: [{name: 'foo', age: 1}, {name: 'bar', age: 2}],
      option: 'c'
    }

    expect(satisfies(composite, good))   .toBe(true)
    expect(satisfies(composite, badUser)).toBe(false)
    expect(satisfies(composite, badOpt)) .toBe(false)
  })

  it('marks objects that passed the typecheck so they can be fast-tracked later', function() {
    let type = {x: isNumber}
    let value = {x: 1}
    satisfies(type, value)
    expect(value._verse_type).toBe(type)
  })
})
