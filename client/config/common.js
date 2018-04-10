const _ = require('lodash');
const path = require('path');
const webpack = require('webpack');
const {
  WEBPACK_OUTPUT_DIR,
  ASSET_PUBLIC_PATH,
  ASSET_MANIFEST_FILENAME,
} = require('../../config/const.json');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const resolveApp = (...relativePaths) => path.resolve(__dirname, '..', ...relativePaths);

const PUBLIC_PATH = `${_.trimEnd(ASSET_PUBLIC_PATH, '/')}/`;
const OUTPUT_PATH = resolveApp('..', _.trim(WEBPACK_OUTPUT_DIR, '/'));
const SRC_PATH = resolveApp('src');
const MANIFEST_FILENAME = ASSET_MANIFEST_FILENAME;

const defaultEntry = ['babel-polyfill'];

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
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'commons',
      minChunks: 2,
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
  ],
};

module.exports = {
  PUBLIC_PATH,
  OUTPUT_PATH,
  SRC_PATH,
  MANIFEST_FILENAME,
  config,
};
