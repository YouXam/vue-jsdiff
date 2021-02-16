'use strict'

exports.__esModule = true
exports.jsonDiff = undefined

var _typeof = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? function (obj) { return typeof obj } : function (obj) { return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj }

exports.diffJson = diffJson
exports.canonicalize = canonicalize

var _base = require('./base')

var _base2 = _interopRequireDefault(_base)

var _line = require('./line')

function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }

var objectPrototypeToString = Object.prototype.toString

// eslint-disable-next-line new-cap
var jsonDiff = exports.jsonDiff = new _base2.default()
// Discriminate between two lines of pretty-printed, serialized JSON where one of them has a
// dangling comma and the other doesn't. Turns out including the dangling comma yields the nicest output:
jsonDiff.useLongestToken = true

jsonDiff.tokenize = _line.lineDiff.tokenize
jsonDiff.castInput = function (value) {
  var _options = this.options
  var undefinedReplacement = _options.undefinedReplacement
  var _options$stringifyRep = _options.stringifyReplacer
  var stringifyReplacer = _options$stringifyRep === undefined ? function (k, v) {
    return (typeof v === 'undefined' ? undefinedReplacement : v
    )
  } : _options$stringifyRep

  return typeof value === 'string' ? value : JSON.stringify(canonicalize(value, null, null, stringifyReplacer), stringifyReplacer, '  ')
}
jsonDiff.equals = function (left, right) {
  return (_base2.default.prototype.equals.call(jsonDiff, left.replace(/,([\r\n])/g, '$1'), right.replace(/,([\r\n])/g, '$1'))
  )
}

function diffJson (oldObj, newObj, options) {
  return jsonDiff.diff(oldObj, newObj, options)
}

// This function handles the presence of circular references by bailing out when encountering an
// object that is already on the "stack" of items being processed. Accepts an optional replacer
function canonicalize (obj, stack, replacementStack, replacer, key) {
  stack = stack || []
  replacementStack = replacementStack || []

  if (replacer) {
    obj = replacer(key, obj)
  }

  var i

  for (i = 0; i < stack.length; i += 1) {
    if (stack[i] === obj) {
      return replacementStack[i]
    }
  }

  var canonicalizedObj

  if (objectPrototypeToString.call(obj) === '[object Array]') {
    stack.push(obj)
    canonicalizedObj = new Array(obj.length)
    replacementStack.push(canonicalizedObj)
    for (i = 0; i < obj.length; i += 1) {
      canonicalizedObj[i] = canonicalize(obj[i], stack, replacementStack, replacer, key)
    }
    stack.pop()
    replacementStack.pop()
    return canonicalizedObj
  }

  if (obj && obj.toJSON) {
    obj = obj.toJSON()
  }

  if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && obj !== null) {
    stack.push(obj)
    canonicalizedObj = {}
    replacementStack.push(canonicalizedObj)
    var sortedKeys = []
    var _key
    for (_key in obj) {
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty(_key)) {
        sortedKeys.push(_key)
      }
    }
    sortedKeys.sort()
    for (i = 0; i < sortedKeys.length; i += 1) {
      _key = sortedKeys[i]
      canonicalizedObj[_key] = canonicalize(obj[_key], stack, replacementStack, replacer, _key)
    }
    stack.pop()
    replacementStack.pop()
  } else {
    canonicalizedObj = obj
  }
  return canonicalizedObj
}
