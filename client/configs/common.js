const path = require('path');
const webpack = require('webpack');

const resolvePath = (...relativePaths) => path.resolve(__dirname, '..', ...relativePaths);

const PUBLIC_PATH = '/super/client/dist/';
const OUTPUT_PATH = resolvePath('dist');
const SRC_PATH = resolvePath('js');
const MANIFEST_FILENAME = 'manifest.json';

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
  resolvePath,
  config,
};
