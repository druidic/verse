function App(global) {
  const {
    viewTestResults,
    getStateType,
    reducer,
    view,
    init,
  } = global

  if (!view) throw 'You must define a view() function at the top level'

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
