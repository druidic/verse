describe('lastOf', function() {
  it('returns undefined for an empty list', () => {
    expect(lastOf([])).not.toBeDefined()
  })

  it('returns the only element of a one-element list', () => {
    expect(lastOf([5])).toBe(5)
  })

  it('returns the last element of a longer list', () => {
    expect(lastOf([5, 6, 7])).toBe(7)
  })
})
