function StateContainer(type) {
  return {
    getState
  }

  function getState() {
    return getDefaultValue(type)
  }
}
