'use strict'
exports.__esModule = true
exports.applyPatch = applyPatch
exports.applyPatches = applyPatches
var _parse = require('./parse')

var _distanceIterator = require('../util/distance-iterator')

var _distanceIterator2 = _interopRequireDefault(_distanceIterator)

function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }

function applyPatch (source, uniDiff) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {}

  if (typeof uniDiff === 'string') {
    uniDiff = (0, _parse.parsePatch)(uniDiff)
  }

  if (Array.isArray(uniDiff)) {
    if (uniDiff.length > 1) {
      throw new Error('applyPatch only works with a single input.')
    }

    uniDiff = uniDiff[0]
  }

  // Apply the diff to the input
  var lines = source.split(/\r\n|[\n\v\f\r\x85]/)
  var delimiters = source.match(/\r\n|[\n\v\f\r\x85]/g) || []
  var hunks = uniDiff.hunks
  var compareLine = options.compareLine || function (lineNumber, line, operation, patchContent) {
    return (line === patchContent
    )
  }
  var errorCount = 0
  var fuzzFactor = options.fuzzFactor || 0
  var minLine = 0
  var offset = 0
  var removeEOFNL
  var addEOFNL

  /**
   * Checks if the hunk exactly fits on the provided location
   */
  function hunkFits (hunk, toPos) {
    for (var j = 0; j < hunk.lines.length; j++) {
      var line = hunk.lines[j]
      var operation = line.length > 0 ? line[0] : ' '
      var content = line.length > 0 ? line.substr(1) : line

      if (operation === ' ' || operation === '-') {
        // Context sanity check
        if (!compareLine(toPos + 1, lines[toPos], operation, content)) {
          errorCount++

          if (errorCount > fuzzFactor) {
            return false
          }
        }
        toPos++
      }
    }

    return true
  }

  // Search best fit offsets for each hunk based on the previous ones
  for (var i = 0; i < hunks.length; i++) {
    var hunk = hunks[i]
    var maxLine = lines.length - hunk.oldLines
    var localOffset = 0
    var toPos = offset + hunk.oldStart - 1

    var iterator = (0, _distanceIterator2.default)(toPos, minLine, maxLine)

    for (; localOffset !== undefined; localOffset = iterator()) {
      if (hunkFits(hunk, toPos + localOffset)) {
        hunk.offset = offset += localOffset
        break
      }
    }

    if (localOffset === undefined) {
      return false
    }

    // Set lower text limit to end of the current hunk, so next ones don't try
    // to fit over already patched text
    minLine = hunk.offset + hunk.oldStart + hunk.oldLines
  }

  // Apply patch hunks
  var diffOffset = 0
  for (var _i = 0; _i < hunks.length; _i++) {
    var _hunk = hunks[_i]
    var _toPos = _hunk.oldStart + _hunk.offset + diffOffset - 1
    diffOffset += _hunk.newLines - _hunk.oldLines

    if (_toPos < 0) {
      // Creating a new file
      _toPos = 0
    }

    for (var j = 0; j < _hunk.lines.length; j++) {
      var line = _hunk.lines[j]
      var operation = line.length > 0 ? line[0] : ' '
      var content = line.length > 0 ? line.substr(1) : line
      var delimiter = _hunk.linedelimiters[j]

      if (operation === ' ') {
        _toPos++
      } else if (operation === '-') {
        lines.splice(_toPos, 1)
        delimiters.splice(_toPos, 1)
      } else if (operation === '+') {
        lines.splice(_toPos, 0, content)
        delimiters.splice(_toPos, 0, delimiter)
        _toPos++
      } else if (operation === '\\') {
        var previousOperation = _hunk.lines[j - 1] ? _hunk.lines[j - 1][0] : null
        if (previousOperation === '+') {
          removeEOFNL = true
        } else if (previousOperation === '-') {
          addEOFNL = true
        }
      }
    }
  }

  // Handle EOFNL insertion/removal
  if (removeEOFNL) {
    while (!lines[lines.length - 1]) {
      lines.pop()
      delimiters.pop()
    }
  } else if (addEOFNL) {
    lines.push('')
    delimiters.push('\n')
  }
  for (var _k = 0; _k < lines.length - 1; _k++) {
    lines[_k] = lines[_k] + delimiters[_k]
  }
  return lines.join('')
}

// Wrapper that supports multiple file patches via callbacks.
function applyPatches (uniDiff, options) {
  if (typeof uniDiff === 'string') {
    uniDiff = (0, _parse.parsePatch)(uniDiff)
  }

  var currentIndex = 0
  function processIndex () {
    var index = uniDiff[currentIndex++]
    if (!index) {
      return options.complete()
    }

    options.loadFile(index, function (err, data) {
      if (err) {
        return options.complete(err)
      }

      var updatedContent = applyPatch(data, index, options)
      options.patched(index, updatedContent, function (err) {
        if (err) {
          return options.complete(err)
        }

        processIndex()
      })
    })
  }
  processIndex()
}
