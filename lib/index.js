const _character = require('./diff/character')
const _word = require('./diff/word')
const _line = require('./diff/line')
const _sentence = require('./diff/sentence')
const _css = require('./diff/css')
const _json = require('./diff/json')
const _array = require('./diff/array')
const _apply = require('./patch/apply')
const _parse = require('./patch/parse')
const _merge = require('./patch/merge')
const _create = require('./patch/create')
const _dmp = require('./convert/dmp')
const _xml = require('./convert/xml')
export default {
  diffChars: _character.diffChars,
  diffWords: _word.diffWords,
  diffWordsWithSpace: _word.diffWordsWithSpace,
  diffLines: _line.diffLines,
  diffTrimmedLines: _line.diffTrimmedLines,
  diffSentences: _sentence.diffSentences,
  diffCss: _css.diffCss,
  diffJson: _json.diffJson,
  diffArrays: _array.diffArrays,
  structuredPatch: _create.structuredPatch,
  createTwoFilesPatch: _create.createTwoFilesPatch,
  createPatch: _create.createPatch,
  applyPatch: _apply.applyPatch,
  applyPatches: _apply.applyPatches,
  parsePatch: _parse.parsePatch,
  merge: _merge.merge,
  convertChangesToDMP: _dmp.convertChangesToDMP,
  convertChangesToXML: _xml.convertChangesToXML,
  canonicalize: _json.canonicalize
}
