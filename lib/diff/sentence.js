'use strict'

exports.__esModule = true
exports.sentenceDiff = undefined
exports.diffSentences = diffSentences

var _base = require('./base')

var _base2 = _interopRequireDefault(_base)

function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }

// eslint-disable-next-line new-cap
var sentenceDiff = exports.sentenceDiff = new _base2.default()
sentenceDiff.tokenize = function (value) {
  return value.split(/(\S.+?[.!?])(?=\s+|$)/)
}

function diffSentences (oldStr, newStr, callback) {
  return sentenceDiff.diff(oldStr, newStr, callback)
}
