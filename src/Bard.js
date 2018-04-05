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
    let saga

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
      updateScreen()
      waitingForChar = true
      return

      case 'wait':
      updateScreen()
      waitTimeout = setTimeout(run, effect.seconds * 1000)
      return

      case 'startTimer':
      let interval = setInterval(callAndRender(effect.callback), effect.seconds * 1000)
      lastOf(stack).timers.push(interval)
      run()
      return

      case 'jump':
      while (stack.length) pop()
      push(effect.generator)
      run()
      return

      case 'retry':
      saga = pop()
      push(saga.generator)
      run()
      return

      case 'log':
      view.log(effect.message)
      run()
      return

      case 'startDisplay':
      saga = lastOf(stack)
      saga.render = effect.render
      updateScreen()
      run()
      return

      case 'startInputDisplay':
      saga = lastOf(stack)
      saga.inputRender = effect.render
      updateScreen()
      run()
      return

      default:
      throw 'You `yield`ed something weird: ' + JSON.stringify(effect)
    }
  }

  function push(generator) {
    let saga = generator(store.emit)
    saga.timers = []
    saga.generator = generator
    saga.render = null
    saga.inputRender = null
    stack.push(saga)
  }

  function pop() {
    let saga = stack.pop()
    saga.timers.forEach(clearInterval)
    return saga
  }

  function updateScreen() {
    let render, inputRender, i
    for (i = stack.length - 1; i >= 0; i--) {
      if (!render && stack[i].render) {
        render = stack[i].render
      }
      if (!inputRender && stack[i].inputRender) {
        inputRender = stack[i].inputRender
      }
      if (render && inputRender) break;
    }

    if (render) view.screen(render(store.getState()))
    if (inputRender) view.input(inputRender(store.getState()))
  }

  function callAndRender(fn) {
    return function() {
      fn()
      updateScreen()
    }
  }
}
