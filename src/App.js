function App(global) {
  let {
    viewTestResults,
    getStateType,
    reducer,
    view,
    init,
  } = global

  if (!view) throw 'You must define a view() function at the top level'
  if (!getStateType) getStateType = () => ({})
  if (!init) init = function*() {}

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
