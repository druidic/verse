describe('StateContainer', () => {
  it('generates an initial state from the given type', () => {
    let c = StateContainer(isString)
    expect(c.getState()).toEqual('')
  })
})
