const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

const resolvePath = (...relativePaths) => path.resolve(__dirname, '..', ...relativePaths);

const PUBLIC_PATH = '/super/client/dist/';
const OUTPUT_PATH = resolvePath('dist');
const SRC_PATH = resolvePath('js');

const defaultEntry = [];

const config = {
  entry: {
    tags: [...defaultEntry, path.resolve(SRC_PATH, 'tags')],
    menus: [...defaultEntry, path.resolve(SRC_PATH, 'menus')],
    users: [...defaultEntry, path.resolve(SRC_PATH, 'users')],
    user_edit: [...defaultEntry, path.resolve(SRC_PATH, 'user_edit')],
    logs: [...defaultEntry, path.resolve(SRC_PATH, 'logs')],
  },
  output: {
    path: OUTPUT_PATH,
    filename: '[name].[chunkhash].js',
    publicPath: PUBLIC_PATH,
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.jsx', '.elm'],
    enforceExtension: false,
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        loader: 'babel-loader',
        options: {
          presets: [['es2015', { modules: false }], 'react'],
        },
        exclude: ['/node_modules/'],
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader',
        }),
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader',
      },
    ],
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'commons',
      minChunks: 2,
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
    new ExtractTextPlugin({
      filename: 'styles.[contenthash].css',
    }),
    new ManifestPlugin({
      fileName: 'manifest.json',
      publicPath: PUBLIC_PATH,
    }),
  ],
};

module.exports = {
  PUBLIC_PATH,
  OUTPUT_PATH,
  SRC_PATH,
  resolvePath,
  config,
};
