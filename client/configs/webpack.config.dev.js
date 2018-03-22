const _ = require('lodash');
const webpack = require('webpack');
const WriteFilePlugin = require('write-file-webpack-plugin');
const { PUBLIC_PATH, config } = require('./common');

const defaultEntry = [
  'webpack-dev-server/client?http://localhost:3000',
  'webpack/hot/only-dev-server',
];

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
  plugins: [
    ...config.plugins,
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
