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
  return function*() {
    let result = '', a
    while((a = yield waitForChar()) !== '\n')
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
