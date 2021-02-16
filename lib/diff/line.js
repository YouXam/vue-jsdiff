'use strict'

exports.__esModule = true
exports.lineDiff = undefined
exports.diffLines = diffLines
exports.diffTrimmedLines = diffTrimmedLines

var _base = require('./base')

var _base2 = _interopRequireDefault(_base)

var _params = require('../util/params')

function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }

// eslint-disable-next-line new-cap
var lineDiff = exports.lineDiff = new _base2.default()
lineDiff.tokenize = function (value) {
  var retLines = []
  var linesAndNewlines = value.split(/(\n|\r\n)/)

  // Ignore the final empty token that occurs if the string ends with a new line
  if (!linesAndNewlines[linesAndNewlines.length - 1]) {
    linesAndNewlines.pop()
  }

  // Merge the content and line separators into single tokens
  for (var i = 0; i < linesAndNewlines.length; i++) {
    var line = linesAndNewlines[i]

    if (i % 2 && !this.options.newlineIsToken) {
      retLines[retLines.length - 1] += line
    } else {
      if (this.options.ignoreWhitespace) {
        line = line.trim()
      }
      retLines.push(line)
    }
  }

  return retLines
}

function diffLines (oldStr, newStr, callback) {
  return lineDiff.diff(oldStr, newStr, callback)
}
function diffTrimmedLines (oldStr, newStr, callback) {
  var options = (0, _params.generateOptions)(callback, { ignoreWhitespace: true })
  return lineDiff.diff(oldStr, newStr, options)
}
