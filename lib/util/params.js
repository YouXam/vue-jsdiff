'use strict'
exports.__esModule = true
exports.generateOptions = generateOptions
function generateOptions (options, defaults) {
  if (typeof options === 'function') {
    defaults.callback = options
  } else if (options) {
    for (var name in options) {
      // eslint-disable-next-line no-prototype-builtins
      if (options.hasOwnProperty(name)) {
        defaults[name] = options[name]
      }
    }
  }
  return defaults
}
