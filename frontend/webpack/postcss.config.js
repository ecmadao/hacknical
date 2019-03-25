
const path = require('path')
const PATH = require('../../config/path')
const styleVariables = require(path.resolve(PATH.SOURCE_PATH, 'src/styles/variables'))

module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-cssnext': {
      autoprefixer: {
        browsers: 'ie >= 9'
      },
      features: {
        customProperties: {
          variables: styleVariables
        }
      }
    },
    'postcss-reporter': {},
    'css-mqpacker': {},
  }
}
