const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const { PUBLIC_PATH, SRC_PATH, MANIFEST_FILENAME, config } = require('./common');

module.exports = {
  ...config,
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        include: SRC_PATH,
      },
      {
        test: /\.(css|less)$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: { sourceMap: true },
            },
            {
              loader: 'less-loader',
              options: { sourceMap: true },
            },
          ],
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
