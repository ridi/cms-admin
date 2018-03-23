const _ = require('lodash');
const webpack = require('webpack');
const ManifestPlugin = require('webpack-manifest-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const { PUBLIC_PATH, SRC_PATH, MANIFEST_FILENAME, config } = require('./common');

const DEV_SERVER_HOST = 'localhost';
const DEV_SERVER_PORT = '3000';
const DEV_SERVER_URL = `http://${DEV_SERVER_HOST}:${DEV_SERVER_PORT}`;
const PUBLIC_URL = `${DEV_SERVER_URL}/${_.trim(PUBLIC_PATH, '/')}`;

const defaultEntry = [
  `webpack-dev-server/client?${DEV_SERVER_URL}`,
  'webpack/hot/only-dev-server',
];

const createManifestPlugin = (options) => {
  const filename = 'style.css';
  const manifestPlugin = new ManifestPlugin({
    seed: {
      'commons.css': `${PUBLIC_URL}/${filename}`,
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
      publicPath: `${PUBLIC_URL}/`,
    }),
    new webpack.HotModuleReplacementPlugin(),
    new WriteFilePlugin({
      test: new RegExp(`${_.escapeRegExp(MANIFEST_FILENAME)}$`),
    }),
  ],
  devServer: {
    publicPath: PUBLIC_PATH,
    port: DEV_SERVER_PORT,
    proxy: {
      '*': 'http://localhost',
    },
    disableHostCheck: true,
    inline: true,
    hot: true,
  },
};
