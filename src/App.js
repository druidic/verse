function App(global) {
  const {
    viewTestResults,
    getStateType,
    reducer,
    view,
    init,
  } = global

  let results = runTests(getTestFunctions(global))
  if (results.failures.length) {
    viewTestResults(results)
    return NullBard()
  }

  let store = Store(getStateType(), reducer)
  bard = Bard(store, view)
  bard.begin(init)

  return bard
}
