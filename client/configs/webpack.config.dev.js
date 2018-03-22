const _ = require('lodash');
const path = require('path');
const webpack = require('webpack');
const ManifestPlugin = require('webpack-manifest-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const { PUBLIC_PATH, SRC_PATH, MANIFEST_FILENAME, config } = require('./common');

const defaultEntry = [
  'webpack-dev-server/client?http://localhost:3000',
  'webpack/hot/only-dev-server',
];

const createManifestPlugin = (options) => {
  const filename = 'style.css';
  const manifestPlugin = new ManifestPlugin({
    seed: {
      'commons.css': path.resolve(PUBLIC_PATH, filename),
    },
    ...options,
  });

  return {
    ...manifestPlugin,
    apply: (compiler) => {
      compiler.plugin('compilation', (compilation) => {
        compilation.assets[filename] = {
          source: () => '',
          size: () => 0,
        };
      });
      manifestPlugin.apply(compiler);
    },
  };
};

module.exports = {
  ...config,
  entry: _.mapValues(config.entry, value => _.flattenDeep([
    defaultEntry,
    value,
  ])),
  output: {
    ...config.output,
    filename: '[name].js',
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
        use: ['style-loader', 'css-loader'],
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
      publicPath: PUBLIC_PATH,
    }),
    new webpack.HotModuleReplacementPlugin(),
    new WriteFilePlugin({
      test: /manifest\.json$/,
    }),
  ],
  devServer: {
    publicPath: PUBLIC_PATH,
    port: 3000,
    proxy: {
      '*': 'http://localhost:8012',
    },
    inline: true,
    hot: true,
  },
};
