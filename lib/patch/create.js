'use strict'

exports.__esModule = true
exports.structuredPatch = structuredPatch
exports.createTwoFilesPatch = createTwoFilesPatch
exports.createPatch = createPatch

var _line = require('../diff/line')

function _toConsumableArray (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i] } return arr2 } else { return Array.from(arr) } }

function structuredPatch (oldFileName, newFileName, oldStr, newStr, oldHeader, newHeader, options) {
  if (!options) {
    options = {}
  }
  if (typeof options.context === 'undefined') {
    options.context = 4
  }

  var diff = (0, _line.diffLines)(oldStr, newStr, options)
  diff.push({ value: '', lines: [] }) // Append an empty value to make cleanup easier

  function contextLines (lines) {
    return lines.map(function (entry) {
      return ' ' + entry
    })
  }

  var hunks = []
  var oldRangeStart = 0
  var newRangeStart = 0
  var curRange = []
  var oldLine = 1
  var newLine = 1

  var _loop = function _loop (i) {
    var current = diff[i]
    var lines = current.lines || current.value.replace(/\n$/, '').split('\n')
    current.lines = lines

    if (current.added || current.removed) {
      var _curRange

      // If we have previous context, start with that
      if (!oldRangeStart) {
        var prev = diff[i - 1]
        oldRangeStart = oldLine
        newRangeStart = newLine

        if (prev) {
          curRange = options.context > 0 ? contextLines(prev.lines.slice(-options.context)) : []
          oldRangeStart -= curRange.length
          newRangeStart -= curRange.length
        }
      }

      // Output our changes
      (_curRange = curRange).push.apply(_curRange, _toConsumableArray(lines.map(function (entry) {
        return (current.added ? '+' : '-') + entry
      })))

      // Track the updated file position
      if (current.added) {
        newLine += lines.length
      } else {
        oldLine += lines.length
      }
    } else {
      // Identical context lines. Track line changes
      if (oldRangeStart) {
        // Close out any changes that have been output (or join overlapping)
        if (lines.length <= options.context * 2 && i < diff.length - 2) {
          var _curRange2;

          // Overlapping
          (_curRange2 = curRange).push.apply(_curRange2, _toConsumableArray(contextLines(lines)))
        } else {
          var _curRange3

          // end the range and output
          var contextSize = Math.min(lines.length, options.context);
          (_curRange3 = curRange).push.apply(_curRange3, _toConsumableArray(contextLines(lines.slice(0, contextSize))))

          var hunk = {
            oldStart: oldRangeStart,
            oldLines: oldLine - oldRangeStart + contextSize,
            newStart: newRangeStart,
            newLines: newLine - newRangeStart + contextSize,
            lines: curRange
          }
          if (i >= diff.length - 2 && lines.length <= options.context) {
            // EOF is inside this hunk
            var oldEOFNewline = /\n$/.test(oldStr)
            var newEOFNewline = /\n$/.test(newStr)
            if (lines.length === 0 && !oldEOFNewline) {
              // special case: old has no eol and no trailing context; no-nl can end up before adds
              curRange.splice(hunk.oldLines, 0, '\\ No newline at end of file')
            } else if (!oldEOFNewline || !newEOFNewline) {
              curRange.push('\\ No newline at end of file')
            }
          }
          hunks.push(hunk)

          oldRangeStart = 0
          newRangeStart = 0
          curRange = []
        }
      }
      oldLine += lines.length
      newLine += lines.length
    }
  }

  for (var i = 0; i < diff.length; i++) {
    _loop(i)
  }

  return {
    oldFileName: oldFileName,
    newFileName: newFileName,
    oldHeader: oldHeader,
    newHeader: newHeader,
    hunks: hunks
  }
}

function createTwoFilesPatch (oldFileName, newFileName, oldStr, newStr, oldHeader, newHeader, options) {
  var diff = structuredPatch(oldFileName, newFileName, oldStr, newStr, oldHeader, newHeader, options)

  var ret = []
  if (oldFileName === newFileName) {
    ret.push('Index: ' + oldFileName)
  }
  ret.push('===================================================================')
  ret.push('--- ' + diff.oldFileName + (typeof diff.oldHeader === 'undefined' ? '' : '\t' + diff.oldHeader))
  ret.push('+++ ' + diff.newFileName + (typeof diff.newHeader === 'undefined' ? '' : '\t' + diff.newHeader))

  for (var i = 0; i < diff.hunks.length; i++) {
    var hunk = diff.hunks[i]
    ret.push('@@ -' + hunk.oldStart + ',' + hunk.oldLines + ' +' + hunk.newStart + ',' + hunk.newLines + ' @@')
    ret.push.apply(ret, hunk.lines)
  }

  return ret.join('\n') + '\n'
}

function createPatch (fileName, oldStr, newStr, oldHeader, newHeader, options) {
  return createTwoFilesPatch(fileName, fileName, oldStr, newStr, oldHeader, newHeader, options)
}
