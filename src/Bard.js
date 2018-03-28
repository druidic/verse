function Bard(store) {
  let stack = []
  let state = ''

  return {
    begin,
    receiveKeydown
  }

  function begin(generator) {
    let saga = generator(store.emit)
    saga.timers = []
    saga.generator = generator
    stack.push(saga)
    run()
  }

  function receiveKeydown({key}) {
    if (state !== 'waiting for char') return
    run(key)
  }

  function run(returnFromYield) {
    if (!stack.length) return
    let {value: effect, done} = lastOf(stack).next(returnFromYield)

    if (done) {
      pop()
      run(effect)
      return
    }

    _expect(effect, or(isObject, isGeneratorFunction))

    if (isGeneratorFunction(effect)) {
      begin(effect)
      return
    }

    if (effect.effectType === 'waitForChar') {
      state = 'waiting for char'
    }

    if (effect.effectType === 'wait') {
      setTimeout(run, effect.seconds * 1000)
    }

    if (effect.effectType === 'startTimer') {
      let interval = setInterval(effect.callback, effect.seconds * 1000)
      lastOf(stack).timers.push(interval)
      run()
    }

    if (effect.effectType === 'jump') {
      while (stack.length) pop()
      begin(effect.generator)
    }

    if (effect.effectType === 'retry') {
      let saga = pop()
      begin(saga.generator)
    }

    if (effect.effectType === 'cancel') {
      pop()
      run()
    }
  }

  function pop() {
    let saga = stack.pop()
    saga.timers.forEach(clearInterval)
    return saga
  }
}
