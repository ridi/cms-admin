const _ = require('lodash');
const webpack = require('webpack');
const ManifestPlugin = require('webpack-manifest-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const { PUBLIC_PATH, SRC_PATH, MANIFEST_FILENAME, config } = require('./common');

process.env.NODE_ENV = 'development';

const DEV_SERVER_HOST = 'localhost';
const DEV_SERVER_PORT = '3000';
const DEV_SERVER_URL = `http://${DEV_SERVER_HOST}:${DEV_SERVER_PORT}`;
const PUBLIC_URL = `${DEV_SERVER_URL}/${_.trim(PUBLIC_PATH, '/')}/`;

const defaultEntry = [
  `webpack-dev-server/client?${DEV_SERVER_URL}`,
  'webpack/hot/only-dev-server',
];

// ExtractTextPlugin cannot be used with webpack-dev-server
// and the common CSS file is not generated also not written in manifest file.
// So we need to tell webpack to generate the common CSS file and add it into manifest file
// so that make it possible to link the common CSS file from html.
const createManifestPlugin = (options) => {
  const cssFilename = 'commons.css';

  // Add the common CSS file path to manifest file
  const manifestPlugin = new ManifestPlugin({
    seed: {
      'commons.css': `${PUBLIC_URL}${cssFilename}`,
    },
    ...options,
  });

  return {
    ...manifestPlugin,

    // Override ManifestPlugin's behavior
    apply: (compiler) => {

      // Add empty common CSS file to output.
      // It's just OK to serve empty file
      // because the actual CSS is injected into <style> tag by style-loader
      compiler.hooks.compilation.tap('DummyCssPlugin', (compilation) => {
        compilation.assets[cssFilename] = {
          source: () => '',
          size: () => 0,
        };
      });

      // Apply original ManifestPlugin
      manifestPlugin.apply(compiler);
    },
  };
};

module.exports = {
  ...config,
  mode: process.env.NODE_ENV,
  devtool: 'cheap-module-source-map',
  entry: _.mapValues(config.entry, value => _.flattenDeep([
    defaultEntry,
    value,
  ])),
  output: {
    ...config.output,
    filename: '[name].js',
    publicPath: PUBLIC_URL,
  },
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
          {
            loader: 'style-loader',
            options: {
              insertAt: 'top',
            },
          },
          'css-loader',
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader',
      },
    ],
  },
  plugins: [
    ...config.plugins,
    createManifestPlugin({
      fileName: MANIFEST_FILENAME,
      publicPath: PUBLIC_URL,
    }),
    new webpack.HotModuleReplacementPlugin(),
    new WriteFilePlugin({
      test: new RegExp(`${_.escapeRegExp(MANIFEST_FILENAME)}$`),
    }),
  ],
  devServer: {
    host: DEV_SERVER_HOST,
    port: DEV_SERVER_PORT,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    disableHostCheck: true,
    inline: true,
    hot: true,
    stats: 'minimal',
  },
};
