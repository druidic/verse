function Store(type, reducer) {
  let state = getDefaultValue(type)

  return {
    getState,
    emit
  }

  function getState() {
    return state
  }

  function emit(action) {
    let newState = reducer(state, action)
    _expect(newState, satisfies, type)
    state = newState
  }
}
