describe('translateError', () => {
  it('renders an infinite recursion error on webkit', () => {
    expect(translateError(new RangeError('Maximum call stack size exceeded')).message)
      .toBe('Too many retry() calls. Is there an infinite loop?')
  })

  it('renders an infinite recursion error on Firefox', () => {
    expect(translateError(new Error('too much recursion')).message)
      .toBe('Too many retry() calls. Is there an infinite loop?')
  })

  it('renders an unknown error as its message', () => {
    expect(translateError(new Error('foo')).message)
      .toBe('foo')
  })
})
