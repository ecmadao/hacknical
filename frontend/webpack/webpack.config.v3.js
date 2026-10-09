const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
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
    entries[filename] = ['core-js/stable', 'regenerator-runtime/runtime', filepath]
  })

const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    postcssOptions: {
      config: path.join(__dirname, 'postcss.config.js')
    }
  }
}

const plugins = [
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

const reactManifest = path.join(PATH.BUILD_PATH, 'react-manifest.json')
const runtimeManifest = path.join(PATH.BUILD_PATH, 'runtime-manifest.json')
if (fs.existsSync(reactManifest)) {
  plugins.push(
    new webpack.DllReferencePlugin({
      context: PATH.ROOT_PATH,
      manifest: require(reactManifest)
    })
  )
}
if (fs.existsSync(runtimeManifest)) {
  plugins.push(
    new webpack.DllReferencePlugin({
      context: PATH.ROOT_PATH,
      manifest: require(runtimeManifest)
    })
  )
}

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
        loader: 'expose-loader',
        options: {
          exposes: ['$', 'jQuery']
        }
      },
      {
        test: /\.css$/,
        include: PATH.SOURCE_PATH,
        exclude: path.join(PATH.SOURCE_PATH, 'src/vendor'),
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]___[hash:base64:5]',
                exportLocalsConvention: 'asIs',
                namedExport: false
              },
              sourceMap: true,
              importLoaders: 1
            }
          },
          postcssLoader
        ]
      },
      {
        test: /\.css$/,
        include: /light-ui/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]___[hash:base64:5]',
                exportLocalsConvention: 'asIs',
                namedExport: false
              },
              sourceMap: true,
              importLoaders: 1
            }
          },
          postcssLoader
        ]
      },
      {
        test: /\.css$/,
        include: PATH.MODULES_PATH,
        exclude: /light-ui/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 1
            }
          },
          postcssLoader
        ]
      },
      {
        test: /\.css$/,
        include: path.join(PATH.SOURCE_PATH, 'src/vendor'),
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 1
            }
          },
          postcssLoader
        ]
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader'
      },
      {
        test: /\.(eot|ttf|woff|woff2|otf)(\?v=\d+\.\d+\.\d+)?$/,
        type: 'asset/resource',
        generator: {
          filename: '[name][ext]'
        }
      },
      {
        test: /\.(jpe?g|png|gif|svg)\??.*$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8192
          }
        },
        generator: {
          filename: '[name][ext]'
        }
      }
    ]
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
      LOCALES: path.join(PATH.SOURCE_PATH, 'utils/locales'),
      'babel-polyfill': 'core-js/stable'
    }
  },
  plugins
}
