function Bard(store) {
  return {begin}

  function begin(generator) {
    let saga = generator(store.emit)
    recountTillNextEffect(saga)
  }

  function recountTillNextEffect(saga) {
    let effect = saga.next()
    if (effect.done) return
    _expect(effect.value, isObject)
    if (effect.value.effectType === 'wait') {
      setTimeout(
        () => recountTillNextEffect(saga),
        effect.value.seconds * 1000)
    }
  }
}
