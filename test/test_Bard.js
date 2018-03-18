describe('Bard', () => {
  let store, b
  beforeEach(() => {
    store = jasmine.createSpyObj('store', ['emit'])
    b = Bard(store)
    jasmine.clock().install()
  })

  afterEach(() => {
    jasmine.clock().uninstall()
  })

  it('tells a simple tale', () => {
    b.begin(function*(tell) {
      tell('once upon a time')
    })
    expect(store.emit).toHaveBeenCalledWith('once upon a time')
  })

  it('pauses for effect', () => {
    b.begin(function*(tell) {
      yield wait(1)
      tell('once upon a time')
    })
    expect(store.emit).not.toHaveBeenCalled()
    jasmine.clock().tick(1001)
    expect(store.emit).toHaveBeenCalledWith('once upon a time')
  })

  it('pauses repeatedly', () => {
    b.begin(function*(tell) {
      yield wait(1)
      tell('once upon a time')
      yield wait(1)
      tell('there was a dog')
    })
    expect(store.emit).not.toHaveBeenCalled()
    jasmine.clock().tick(1001)
    expect(store.emit).toHaveBeenCalledWith('once upon a time')
    expect(store.emit).not.toHaveBeenCalledWith('there was a dog')
    jasmine.clock().tick(1000)
    expect(store.emit).toHaveBeenCalledWith('there was a dog')
  })
})
