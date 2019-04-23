
const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const AssetsPlugin = require('assets-webpack-plugin')
const PATH = require('../../config/path')

const entryFiles = fs.readdirSync(PATH.ENTRY_PATH)
const entries = {}

entryFiles
  .filter(file =>
    file.split('.')[0] && file.split('.').slice(-1)[0] === 'js'
  )
  .forEach(file => {
    const filename = file.split('.')[0]
    const filepath = path.join(PATH.ENTRY_PATH, file)
    entries[filename] = ['babel-polyfill', filepath]
})

const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    config: {
      path: path.join(__dirname, 'postcss.config.js')
    }
  }
}

const cssModulesLoader = ExtractTextPlugin.extract({
  fallback: 'style-loader',
  use: [
    {
      loader: 'css-loader',
      options: {
        modules: true,
        sourceMaps: true,
        importLoaders: 1,
        localIdentName: '[name]__[local]___[hash:base64:5]'
      }
    },
    postcssLoader
  ]
})
const cssLoader = ExtractTextPlugin.extract({
  fallback: 'style-loader',
  use: [
    {
      loader: 'css-loader',
      options: {
        sourceMaps: true,
        importLoaders: 1,
      }
    },
    postcssLoader
  ]
})

module.exports = {
  context: PATH.ROOT_PATH,
  entry: entries,
  output: {
    filename: '[name].bundle.js',
    path: PATH.BUILD_PATH,
    publicPath: PATH.PUBLIC_PATH
  },
  module: {
    rules: [
      {
        test: require.resolve('jquery'),
        use: [
          {
            loader: 'expose-loader',
            options: 'jQuery'
          },
          {
            loader: 'expose-loader',
            options: '$'
          }
        ]
      },
      {
        test: /\.css$/,
        include: PATH.SOURCE_PATH,
        exclude: path.join(PATH.SOURCE_PATH, 'src/vendor'),
        loader: cssModulesLoader,
      },
      {
        test: /\.css$/,
        include: /light-ui/,
        // include: /(lib\/react|lib\/raw)/,
        loader: cssModulesLoader,
      },
      {
        test: /\.css$/,
        loader: cssLoader,
        include: PATH.MODULES_PATH,
        exclude: /light-ui/
        // exclude: /(lib\/react|lib\/raw)/,
      },
      {
        test: /\.css$/,
        loader: cssLoader,
        include: path.join(PATH.SOURCE_PATH, 'src/vendor')
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader'
      },
      {
        test: /\.(eot|ttf|woff|woff2|otf)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader',
        options: {
          limit: 5000,
          name: '[name].[ext]'
        }
      },
      {
        test: /\.(jpe?g|png|gif|svg)\??.*$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: '[name].[ext]'
        }
      }
    ],
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      COMPONENTS: path.join(PATH.SOURCE_PATH, 'components'),
      SRC: path.join(PATH.SOURCE_PATH, 'src'),
      STYLES: path.join(PATH.SOURCE_PATH, 'src/styles'),
      UTILS: path.join(PATH.SOURCE_PATH, 'utils'),
      PAGES: path.join(PATH.SOURCE_PATH, 'pages'),
      API: path.join(PATH.SOURCE_PATH, 'api'),
      SHARED: path.join(PATH.SOURCE_PATH, 'pages/shared'),
      LOCALES: path.join(PATH.SOURCE_PATH, 'utils/locales')
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),
    new AssetsPlugin({
      path: PATH.BUILD_PATH,
      filename: 'webpack-assets.json',
      update: true,
      prettyPrint: true
    }),
    new webpack.DllReferencePlugin({
      context: PATH.ROOT_PATH,
      manifest: require(path.join(PATH.BUILD_PATH, 'react-manifest.json'))
    }),
    new webpack.DllReferencePlugin({
      context: PATH.ROOT_PATH,
      manifest: require(path.join(PATH.BUILD_PATH, 'runtime-manifest.json'))
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.SENTRY': JSON.stringify(process.env.HACKNICAL_SENTRY),
      'process.env.URI': JSON.stringify(PATH.CDN_URL)
    }),
    new webpack.BannerPlugin({
      entryOnly: true,
      banner: 'BUILD WITH LOVE BY ECMADAO'
    })
  ]
}
