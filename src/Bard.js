function Bard(store) {
  let stack = []
  return {
    begin,
    receiveKeydown
  }

  function begin(generator) {
    let saga = generator(store.emit)
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
      stack.pop()
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
  }
}
