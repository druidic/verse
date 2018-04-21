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
