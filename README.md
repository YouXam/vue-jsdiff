# vue-jsdiff

[中文](./README_CN.md) | English

A javascript text differencing implementation for Vue.

Vue-jsdiff does not provide UI, is an encapsulation of [jsdiff](https://github.com/kpdecker/jsdiff). Its API is the same as jsdiff ver. 5.0.0.

 ## Installation

 ```
 npm install vue-jsdiff --save
 ```

 ## Examples

 ```javascript
 import Diff from 'vue-jsdiff'
 export default {
  name: 'example',
  created () {
   console.log(Diff.diffLines('old string', 'new string'))
  }
 }
 ```

 ## API list

See [jsdiff](https://github.com/kpdecker/jsdiff/blob/v5.0.0/README.md#api) for detailed documents.

 1. diffChars
 2. diffWords
 3. diffWordsWithSpace
 4. diffLines
 5. diffTrimmedLines
 6. diffSentences
 7. diffCss
 8. diffJson
 9. diffArrays
 10. structuredPatch
 11. createTwoFilesPatch
 12. createPatch
 13. applyPatch
 14. applyPatches
 15. parsePatch
 16. merge
 17. convertChangesToDMP
 18. convertChangesToXML
 19. canonicalize

 ## Other

Vue-jsdiff has no plan for constant maitaining.

 ## License

 Using [BSD License](./LICENSE)