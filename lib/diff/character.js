'use strict'

exports.__esModule = true
exports.characterDiff = undefined
exports.diffChars = diffChars

var _base = require('./base')

var _base2 = _interopRequireDefault(_base)

function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }

// eslint-disable-next-line new-cap
var characterDiff = exports.characterDiff = new _base2.default()
function diffChars (oldStr, newStr, options) {
  return characterDiff.diff(oldStr, newStr, options)
}
