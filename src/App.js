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
  store.subscribe(view)
  bard = Bard(store)
  bard.begin(init)

  return bard
}
