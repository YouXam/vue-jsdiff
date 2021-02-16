'use strict'
exports.__esModule = true
exports.default = function (start, minLine, maxLine) {
  var wantForward = true
  var backwardExhausted = false
  var forwardExhausted = false
  var localOffset = 1

  return function iterator () {
    if (wantForward && !forwardExhausted) {
      if (backwardExhausted) {
        localOffset++
      } else {
        wantForward = false
      }

      // Check if trying to fit beyond text length, and if not, check it fits
      // after offset location (or desired location on first iteration)
      if (start + localOffset <= maxLine) {
        return localOffset
      }

      forwardExhausted = true
    }

    if (!backwardExhausted) {
      if (!forwardExhausted) {
        wantForward = true
      }

      // Check if trying to fit before text beginning, and if not, check it fits
      // before offset location
      if (minLine <= start - localOffset) {
        return -localOffset++
      }

      backwardExhausted = true
      return iterator()
    }

    // We tried to fit hunk before text beginning and beyond text length, then
    // hunk can't fit on the text. Return undefined
  }
}
