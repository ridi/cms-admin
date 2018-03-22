const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

const defaultEntry = [];

module.exports = {
  entry: {
    tags: [...defaultEntry, './js/tags'],
    menus: [...defaultEntry, './js/menus'],
    users: [...defaultEntry, './js/users'],
    user_edit: [...defaultEntry, './js/user_edit'],
    logs: [...defaultEntry, './js/logs'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash].js',
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
      publicPath: '/super/client/dist/',
    }),
  ],
};
