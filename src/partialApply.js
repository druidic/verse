function partialApply(fn, firstArgs) {
  return (...remainingArgs) => fn(...firstArgs, ...remainingArgs)
}
