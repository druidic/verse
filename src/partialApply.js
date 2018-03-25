function partialApply(fn, firstArgs, name) {
  return {[name]: (...remainingArgs) =>
    fn(...firstArgs, ...remainingArgs)
  }[name]
}
