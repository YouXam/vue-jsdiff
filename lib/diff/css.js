'use strict'

exports.__esModule = true
exports.cssDiff = undefined
exports.diffCss = diffCss

var _base = require('./base')

var _base2 = _interopRequireDefault(_base)

function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }

// eslint-disable-next-line new-cap
var cssDiff = exports.cssDiff = new _base2.default()
cssDiff.tokenize = function (value) {
  return value.split(/([{}:;,]|\s+)/)
}

function diffCss (oldStr, newStr, callback) {
  return cssDiff.diff(oldStr, newStr, callback)
}
