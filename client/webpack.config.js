const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    tags: './js/tags',
    menus: './js/menus',
    users: './js/users',
    user_edit: './js/user_edit',
    logs: './js/logs',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
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
        loader: 'babel-loader?' + JSON.stringify({
          presets: ['es2015', 'react'],
          plugins: ['transform-class-properties'],
        }),
        exclude: [/elm-stuff/, /node_modules/],
      },
      {
        test: /\.elm$/,
        loader: 'elm-webpack',
        exclude: [/elm-stuff/, /node_modules/],
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
      }
    ],
    noParse: /\.elm$/,
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'commons',
      chunks: ['users', 'tags'],
      minChunks: 2,
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
    new ExtractTextPlugin({
      filename: 'styles.css',
    })
  ],
};
