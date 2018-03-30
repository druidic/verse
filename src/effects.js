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

function waitForInput() {
  return function*(tell) {
    let result = '', a
    while((a = yield waitForChar()) !== 'Enter')
      result += a
    return result
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

function cancel() {
  return {
    effectType: 'cancel'
  }
}
