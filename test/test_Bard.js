describe('Bard', () => {
  let store, view, b
  beforeEach(() => {
    store = jasmine.createSpyObj('store', ['emit', 'getState'])
    view  = jasmine.createSpyObj('view', ['log', 'screen', 'input', 'error'])
    b = Bard(store, view)
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

  it('interrupts a pause', () => {
    b.begin(function*(tell) {
      let signal = yield wait(1)
      tell('done ' + signal)
    })

    expect(store.emit).not.toHaveBeenCalled()
    b.interrupt()
    expect(store.emit).toHaveBeenCalledWith('done INTERRUPTED')
  })

  it('interrupts with a custom signal', () => {
    b.begin(function*(tell) {
      let signal = yield wait(1)
      tell('done ' + signal)
    })

    expect(store.emit).not.toHaveBeenCalled()
    b.interrupt('boop')
    expect(store.emit).toHaveBeenCalledWith('done boop')
  })

  it('cancels the timeout for an interrupted wait', () => {
    b.begin(function*(tell) {
      yield wait(1)
      tell('done')
      yield wait(10)
      tell('should only be called after 10 seconds')
    })

    b.interrupt()
    expect(store.emit).toHaveBeenCalledWith('done')
    jasmine.clock().tick(1001)
    expect(store.emit).not.toHaveBeenCalledWith('should only be called after 10 seconds')
    jasmine.clock().tick(9000)
    expect(store.emit).toHaveBeenCalledWith('should only be called after 10 seconds')
  })

  it('ignores keypresses while pausing', () => {
    b.begin(function*(tell) {
      yield wait(1)
      tell('done')
    })

    b.receiveKeydown('a')
    expect(store.emit).not.toHaveBeenCalled()
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

  it('interrupts a wait for a keypress', () => {
    b.begin(function*(tell) {
      let c = yield waitForChar()
      tell('' + c)
    })

    b.interrupt()
    expect(store.emit).toHaveBeenCalledWith('INTERRUPTED')
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
    function waitForInput() {
      return function*(tell) {
        let result = '', a
        while((a = yield waitForChar()) !== 'Enter')
          result += a
        return result
      }
    }

    b.begin(function*(tell) {
      tell('once there was a dog, and his name was...')
      let name = yield waitForInput()
      tell(name + '!')
    })

    b.receiveKeydown({key: 'j'})
    b.receiveKeydown({key: 'i'})
    b.receiveKeydown({key: 'm'})
    b.receiveKeydown({key: 'Enter'})
    expect(store.emit).toHaveBeenCalledWith(
      'once there was a dog, and his name was...')
    expect(store.emit).toHaveBeenCalledWith('jim!')
  })

  it('starts a background timer thread', () => {
    b.begin(function*(tell) {
      let i = 0
      yield startTimer(1, () => {
        tell('hello ' + i++)
      })
      tell('main thread')
      yield wait(3)
    })

    expect(store.emit).toHaveBeenCalledWith('main thread')
    expect(store.emit).not.toHaveBeenCalledWith('hello 0')
    jasmine.clock().tick(1001)
    expect(store.emit).toHaveBeenCalledWith('hello 0')
    expect(store.emit).not.toHaveBeenCalledWith('hello 1')
    jasmine.clock().tick(1000)
    expect(store.emit).toHaveBeenCalledWith('hello 1')
  })

  it('stops timers when the stack frame that created them pops', () => {
    b.begin(function*(tell) {
      let a = 0, b = 0
      yield startTimer(0.99, () => tell('a = ' + a++))
      yield startTimer(0.49, () => tell('b = ' + b++))
      tell('main thread')
      yield wait(3)
      tell('done')
    })

    expect(store.emit).toHaveBeenCalledWith('main thread')
    expect(store.emit.calls.count()).toBe(1)
    jasmine.clock().tick(1000)
    expect(store.emit).toHaveBeenCalledWith('a = 0')
    expect(store.emit).toHaveBeenCalledWith('b = 0')
    expect(store.emit).toHaveBeenCalledWith('b = 1')
    expect(store.emit.calls.count()).toBe(4)
    jasmine.clock().tick(1000)
    expect(store.emit).toHaveBeenCalledWith('a = 1')
    expect(store.emit).toHaveBeenCalledWith('b = 2')
    expect(store.emit).toHaveBeenCalledWith('b = 3')
    expect(store.emit.calls.count()).toBe(7)
    jasmine.clock().tick(1001)
    expect(store.emit).toHaveBeenCalledWith('a = 2')
    expect(store.emit).toHaveBeenCalledWith('b = 4')
    expect(store.emit).toHaveBeenCalledWith('b = 5')
    expect(store.emit).toHaveBeenCalledWith('done')
    expect(store.emit.calls.count()).toBe(11)
    jasmine.clock().tick(9999)
    expect(store.emit.calls.count()).toBe(11)
  })

  it('jumps to another story', () => {
    b.begin(function*(tell) {
      yield jump(function*(tell) {
        tell('done')
      })
      tell('this never happens')
    })

    expect(store.emit).toHaveBeenCalledWith('done')
    expect(store.emit).not.toHaveBeenCalledWith('this never happens')
  })

  it('retries the current story', () => {
    let tries = 1
    b.begin(function*(tell) {
      tell('try ' + tries)
      if (tries++ > 2) return
      yield retry()
    })

    expect(store.emit).toHaveBeenCalledWith('try 1')
    expect(store.emit).toHaveBeenCalledWith('try 2')
    expect(store.emit).toHaveBeenCalledWith('try 3')
    expect(store.emit).not.toHaveBeenCalledWith('try 4')
  })

  it('aborts if it senses an infinite loop of retries', () => {
    b.begin(function*(tell) {
      yield retry()
    })
    expect(view.error).toHaveBeenCalled()
    expect(view.error.calls.mostRecent().args[0].message)
      .toBe('Too many retry() calls. Is there an infinite loop?')
  })

  it('logs a message', () => {
    b.begin(function*(tell) {
      yield log('hello, world!')
    })
    expect(view.log).toHaveBeenCalledWith('hello, world!')
  })

  it('plugs the display into a render function', () => {
    b.begin(function*(tell) {
      yield startDisplay(() => {
        return ['whoa']
      })
      yield startInputDisplay(() => {
        return ['1234']
      })
    })
    expect(view.screen).toHaveBeenCalledWith(['whoa'])
    expect(view.input).toHaveBeenCalledWith(['1234'])
  })

  it('re-renders whenever there is a pause in the story', () => {
    b.begin(function*(tell) {
      yield startDisplay(() => {
        return ['whoa']
      })
      yield wait(1)
    })
    expect(view.screen.calls.count()).toBe(2)
  })

  it('re-renders when the Bard pauses for input', () => {
    b.begin(function*(tell) {
      yield startDisplay(() => {
        return ['whoa']
      })
      yield startInputDisplay(() => {
        return ['1234']
      })
      yield waitForChar()
    })
    expect(view.screen.calls.count()).toBe(3)
    expect(view.input.calls.count()).toBe(2)
  })

  it('re-renders when a stack frame pops', () => {
    b.begin(function*(tell) {
      let x = 0
      yield startDisplay(() => {
        return [x]
      })
      x++
    })
    expect(view.screen.calls.count()).toBe(2)
    expect(view.screen).toHaveBeenCalledWith([1])
  })

  it('passes the state to the render function', () => {
    store = Store(isString, state => state + 'x')
    b = Bard(store, view)
    b.begin(function*(tell) {
      yield startDisplay(state => {
        return [state]
      })
      yield startInputDisplay(state => {
        return [state + '1234']
      })
      tell({})
      yield wait(1)
    })
    expect(view.screen).toHaveBeenCalledWith([''])
    expect(view.screen).toHaveBeenCalledWith(['x'])
    expect(view.input).toHaveBeenCalledWith(['1234'])
    expect(view.input).toHaveBeenCalledWith(['x1234'])
  })

  it('reverts the display when the stack frame that rendered it pops', () => {
    b.begin(function*(tell) {
      yield startDisplay(state => {
        return ['outside']
      })
      yield wait(1)
      yield function*() {
        yield startDisplay(state => {
          return ['inside']
        })
        yield wait(1)
      }
      yield wait(1)
    })
    expect(view.screen).toHaveBeenCalledWith(['outside'])
    expect(view.screen).not.toHaveBeenCalledWith(['inside'])
    jasmine.clock().tick(1001)
    // now we're in the inner function*()
    expect(view.screen).toHaveBeenCalledWith(['inside'])
    jasmine.clock().tick(1000)
    // now we're back out
    expect(view.screen.calls.mostRecent().args).toEqual([['outside']])
  })

  it('renders even if more stack frames have been pushed on top of the one that is rendering', () => {
    b.begin(function*(tell) {
      yield startDisplay(() => {
        return ['outside']
      })
      yield startInputDisplay(() => {
        return ['input outside']
      })
      yield function*() {
        yield wait(1)
      }
    })
    expect(view.screen.calls.count()).toEqual(3)
    expect(view.input.calls.count()).toEqual(2)
  })

  it('renders when a timer goes off', () => {
    b.begin(function*(tell) {
      let count = 0
      yield startTimer(1, () => {
        count++
      })
      yield startDisplay(() => [count])
      yield wait(2)
    })
    expect(view.screen).toHaveBeenCalledWith([0])
    jasmine.clock().tick(1001)
    expect(view.screen).toHaveBeenCalledWith([1])
  })

  it('errors if you yield something weird', () => {
    b.begin(function*(tell) {
      yield {boo: 'hoo'}
    })
    expect(view.error).toHaveBeenCalled()
    expect(view.error.calls.mostRecent().args[0].message)
      .toEqual('You `yield`ed something weird: {"boo":"hoo"}')
  })

  it('halts after an error', () => {
    b.begin(function*(tell) {
      yield function*() {
        yield 'bork'
      }
      yield log('never called')
    })
    expect(view.error).toHaveBeenCalled()
    expect(view.log).not.toHaveBeenCalled()
  })
})
