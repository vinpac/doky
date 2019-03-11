import * as path from 'path'
import * as webpack from 'webpack'
import { Configuration } from './load-configuration'

export default (config: Configuration) => {
  const babelLoader = {
    loader: 'babel-loader',
    options: {
      presets: [path.resolve('src', 'babel', 'preset')],
    },
  }

  let webpackConfig = {
    target: 'web',
    cache: true,
    entry: path.resolve(config.output, 'entry.js'),
    mode: 'development',
    devtool: 'cheap-module-source-map',
    context: path.resolve(),
    performance: { hints: false },
    optimization: {
      runtimeChunk: {
        name: 'static/runtime/webpack.js',
      },
      splitChunks: {
        cacheGroups: {
          default: false,
          vendors: false,
        },
      },
    },
    output: {
      publicPath: '/',
      libraryTarget: 'jsonp',
      path: path.resolve(config.output),
      filename: '[name]',
      hotUpdateChunkFilename: 'static/webpack/[id].[hash].hot-update.js',
      hotUpdateMainFilename: 'static/webpack/[hash].hot-update.json',
      chunkFilename: 'static/chunks/[name].js',
      strictModuleExceptionHandling: true,
    },
    module: {
      rules: [
        { test: /\.jsx?$/, use: [babelLoader], exclude: /node_modules/ },
        {
          test: /\.mdx?$/,
          use: [babelLoader, path.resolve('dist/loaders/mdx')],
        },
      ],
    },
    bail: true,
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
  }

  if (config.webpack) {
    webpackConfig = config.webpack(webpackConfig)
  }

  return webpack(webpackConfig)
}
