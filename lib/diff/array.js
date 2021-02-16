'use strict'

exports.__esModule = true
exports.arrayDiff = undefined
exports.diffArrays = diffArrays

var _base = require('./base')

var _base2 = _interopRequireDefault(_base)

function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }

// eslint-disable-next-line new-cap
var arrayDiff = exports.arrayDiff = new _base2.default()
arrayDiff.tokenize = function (value) {
  return value.slice()
}
arrayDiff.join = arrayDiff.removeEmpty = function (value) {
  return value
}

function diffArrays (oldArr, newArr, callback) {
  return arrayDiff.diff(oldArr, newArr, callback)
}
