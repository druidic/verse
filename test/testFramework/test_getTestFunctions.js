describe('getTestFunctions', () => {
  it('returns an empty list when there are no tests', () => {
    expect(getTestFunctions({})).toEqual([])
  })

  it('returns a function whose name begins with test_', () => {
    let theTest = function test_Foo() {}
    expect(getTestFunctions({a: theTest}))
      .toEqual([theTest])
  })

  it('does not return a function whose name does not begin with test_', () => {
    expect(getTestFunctions({a: () => {}}))
      .toEqual([])
  })

  it('does not a function whose name begins with test (with no underscore)', () => {
    let theTest = function testFoo() {}
    expect(getTestFunctions({a: theTest}))
      .toEqual([])
  })

  it('ignores null values on the object', () => {
    expect(() => getTestFunctions({a: null})).not.toThrow()
  })
})
