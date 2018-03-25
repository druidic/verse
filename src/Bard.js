function Bard(store) {
  let stack = []
  return {
    begin,
    receiveKeydown
  }

  function begin(generator) {
    let saga = generator(store.emit)
    saga.timers = []
    stack.push(saga)
    run()
  }

  function receiveKeydown({key}) {
    run(key)
  }

  function run(returnFromYield) {
    if (!stack.length) return
    let {value: effect, done} = lastOf(stack).next(returnFromYield)

    if (done) {
      let saga = stack.pop()
      saga.timers.forEach(clearInterval)
      run(effect)
      return
    }

    _expect(effect, or(isObject, isGeneratorFunction))

    if (isGeneratorFunction(effect)) {
      begin(effect)
      return
    }

    if (effect.effectType === 'wait') {
      setTimeout(run, effect.seconds * 1000)
    }

    if (effect.effectType === 'startTimer') {
      let interval = setInterval(effect.callback, effect.seconds * 1000)
      lastOf(stack).timers.push(interval)
      run()
    }
  }
}
