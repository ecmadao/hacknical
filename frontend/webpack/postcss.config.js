const path = require('path')
const PATH = require('../../config/path')
const styleVariables = require(path.resolve(PATH.SOURCE_PATH, 'src/styles/variables'))

const decls = Object.keys(styleVariables).map(key => `--${key}: ${styleVariables[key]};`).join('\n  ')
const rootRule = `:root {\n  ${decls}\n}`

const injectVariablesPlugin = () => ({
  postcssPlugin: 'postcss-inject-variables',
  Once(root, { parse }) {
    root.prepend(parse(rootRule))
  }
})
injectVariablesPlugin.postcss = true

module.exports = {
  plugins: [
    require('postcss-import')(),
    injectVariablesPlugin(),
    require('postcss-preset-env')({
      stage: 3,
      features: {
        'nesting-rules': true,
        'custom-properties': {
          preserve: true
        }
      }
    })
  ]
}
