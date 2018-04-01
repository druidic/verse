function NullBard() {
  return {
    begin() {},
    receiveKeydown() {},
    interrupt() {},
    stop() {}
  }
}

function Bard(store, view) {
  let stack = []
  let waitingForChar = false
  let waitTimeout = null

  return {
    begin,
    receiveKeydown,
    interrupt,
    stop
  }

  function begin(generator) {
    push(generator)
    run()
  }

  function receiveKeydown({key}) {
    if (!waitingForChar) return
    run(key)
  }

  function interrupt(signal = SIGNAL_INTERRUPTED) {
    clearTimeout(waitTimeout)
    run(signal)
  }

  function stop() {
    while (stack.length) pop()
  }

  function run(returnFromYield) {
    waitingForChar = false
    waitTimeout = null

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
      waitingForChar = true
      return

      case 'wait':
      waitTimeout = setTimeout(run, effect.seconds * 1000)
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

      case 'log':
      view.log(effect.message)
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
