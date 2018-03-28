function Bard(store) {
  let stack = []
  let state = ''

  return {
    begin,
    receiveKeydown
  }

  function begin(generator) {
    push(generator)
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

    if (isGeneratorFunction(effect)) {
      push(effect)
      run()
      return
    }

    switch (effect.effectType) {
      case 'waitForChar':
      state = 'waiting for char'
      return

      case 'wait':
      setTimeout(run, effect.seconds * 1000)
      return

      case 'startTimer':
      let interval = setInterval(effect.callback, effect.seconds * 1000)
      lastOf(stack).timers.push(interval)
      run()
      return

      case 'jump':
      while (stack.length) pop()
      push(effect.generator)
      run()
      return

      case 'retry':
      let saga = pop()
      push(saga.generator)
      run()
      return

      case 'cancel':
      pop()
      run()
      return
    }
  }

  function push(generator) {
    let saga = generator(store.emit)
    saga.timers = []
    saga.generator = generator
    stack.push(saga)
  }

  function pop() {
    let saga = stack.pop()
    saga.timers.forEach(clearInterval)
    return saga
  }
}
