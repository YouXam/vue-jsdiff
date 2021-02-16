'use strict'
exports.__esModule = true
exports.convertChangesToDMP = convertChangesToDMP
function convertChangesToDMP (changes) {
  var ret = []
  var change
  var operation
  for (var i = 0; i < changes.length; i++) {
    change = changes[i]
    if (change.added) {
      operation = 1
    } else if (change.removed) {
      operation = -1
    } else {
      operation = 0
    }

    ret.push([operation, change.value])
  }
  return ret
}
