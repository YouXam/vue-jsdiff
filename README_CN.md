# vue-jsdiff

中文 | [English](./README.md)

Vue的JavaScript文本差异实现。

vue-jsdiff 不提供 UI, 是对 jsdiff 的封装, API 和 jsdiff 的 5.0.0 版本相同

## 安装

```
npm install vue-jsdiff --save
```

## 例子

```javascript
import Diff from 'vue-jsdiff'
export default {
  name: 'example',
  created () {
    console.log(Diff.diffLines('old string', 'new string'))
  }
}
```

## API 列表

详细文档参见 [jsdiff](https://github.com/kpdecker/jsdiff/blob/v5.0.0/README.md#api)

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

## 其它

vue-jsdiff 没有持续维护的计划

## 许可证

使用 [BSD License](./LICENSE)
