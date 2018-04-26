function translateError(error) {
  if (
    // webkit
    (error instanceof RangeError && error.message === 'Maximum call stack size exceeded')
    // moz
    || (error.message === 'too much recursion')) {
    return 'Too many retry() calls. Is there an infinite loop?'
  }
  return error.message
}
