const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const ManifestPlugin = require('webpack-manifest-plugin');
const { PUBLIC_PATH, SRC_PATH, MANIFEST_FILENAME, config } = require('./common');

process.env.NODE_ENV = 'production';

module.exports = {
  ...config,
  mode: process.env.NODE_ENV,
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        include: SRC_PATH,
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader',
      },
    ],
  },
  optimization: {
    ...config.optimization,
    minimizer: [
      ...(config.optimization.minimizer || []),
      new OptimizeCSSAssetsPlugin({}),
    ],
  },
  plugins: [
    ...config.plugins,
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
    new ManifestPlugin({
      fileName: MANIFEST_FILENAME,
      publicPath: PUBLIC_PATH,
    }),
  ],
};
