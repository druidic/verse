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

  it('starts a story-within-a-story', () => {
    b.begin(function*(tell) {
      tell('ahem')
      yield function*(tell) {
        tell('a story')
      }
      tell('the end')
    })

    expect(store.emit).toHaveBeenCalledWith('ahem')
    expect(store.emit).toHaveBeenCalledWith('a story')
    expect(store.emit).toHaveBeenCalledWith('the end')
  })

  it('gets the result of a story-within-a-story', () => {
    b.begin(function*(tell) {
      let story = yield function*(tell) {
        return 'cool story bro'
      }
      tell(story)
      tell('the end')
    })

    expect(store.emit).toHaveBeenCalledWith('cool story bro')
    expect(store.emit).toHaveBeenCalledWith('the end')
  })

  it('waits for divine inspiration from the keyboard', () => {
    b.begin(function*(tell) {
      tell('once there was a dog, and his favorite number was...')
      let number = yield waitForChar()
      tell(number + '!')
    })

    b.receiveKeydown({key: '3'})
    expect(store.emit).toHaveBeenCalledWith(
      'once there was a dog, and his favorite number was...')
    expect(store.emit).toHaveBeenCalledWith('3!')
  })

  it('receives multiple keypresses', () => {
    b.begin(function*(tell) {
      let result = '', a
      while((a = yield waitForChar()) !== '\n')
        result += a
      tell(result)
    })

    b.receiveKeydown({key: '1'})
    b.receiveKeydown({key: '2'})
    b.receiveKeydown({key: '3'})
    b.receiveKeydown({key: '\n'})
    expect(store.emit).toHaveBeenCalledWith('123')
  })

  it('waits for a line of input', () => {
    b.begin(function*(tell) {
      tell('once there was a dog, and his name was...')
      let name = yield waitForInput()
      tell(name + '!')
    })

    b.receiveKeydown({key: 'j'})
    b.receiveKeydown({key: 'i'})
    b.receiveKeydown({key: 'm'})
    b.receiveKeydown({key: '\n'})
    expect(store.emit).toHaveBeenCalledWith(
      'once there was a dog, and his name was...')
    expect(store.emit).toHaveBeenCalledWith('jim!')
  })
})
