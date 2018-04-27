function wait(seconds) {
  return {
    effectType: 'wait',
    seconds
  }
}

function waitForChar() {
  return {
    effectType: 'waitForChar'
  }
}

function waitForInput(prompt='') {
  return function*() {
    let entered = ''
    yield startInputDisplay(() => {
      return [
        prompt,
        '> ' + entered + '_'
      ]
    })
    yield function*() {
      let c = yield waitForChar()
      switch (c) {
        case 'Enter':
        return;

        case 'Backspace':
        entered = entered.slice(0, entered.length - 1)
        break;

        default:
        entered += c
      }
      yield retry()
    }
    // TODO: empty string here is a hack to work around
    // the UI's awkward display implementation.
    yield startInputDisplay(() => [''])
    return entered
  }
}

function startTimer(seconds, callback) {
  return {
    effectType: 'startTimer',
    seconds,
    callback
  }
}

function jump(generator) {
  return {
    effectType: 'jump',
    generator
  }
}

function retry() {
  return {
    effectType: 'retry'
  }
}

function log(message) {
  return {
    effectType: 'log',
    message
  }
}

function startDisplay(render) {
  return {
    effectType: 'startDisplay',
    render
  }
}

function startInputDisplay(render) {
  return {
    effectType: 'startInputDisplay',
    render
  }
}
