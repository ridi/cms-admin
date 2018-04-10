const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const { PUBLIC_PATH, SRC_PATH, MANIFEST_FILENAME, config } = require('./common');

module.exports = {
  ...config,
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        include: SRC_PATH,
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
    ...config.plugins,
    new ExtractTextPlugin({
      filename: 'styles.[contenthash].css',
    }),
    new ManifestPlugin({
      fileName: MANIFEST_FILENAME,
      publicPath: PUBLIC_PATH,
    }),
  ],
};
