const path = require('path');
const LoadablePlugin = require('@loadable/webpack-plugin');

const sharedConfig = {
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
};

module.exports = [
  {
    entry: './src/frontend/index.js',
    output: {
      filename: '[name].js',
      path: path.join(__dirname, 'public/dist'),
      publicPath: '/dist/',
    },
    plugins: [
      new LoadablePlugin(),
    ],
    ...sharedConfig,
  },
  {
    entry: './src/frontend/ssr.js',
    target: 'node',
    output: {
      filename: 'ssr.js',
      path: path.join(__dirname, 'src/api/ssr'),
      libraryTarget: 'commonjs2',
      publicPath: '/dist/',
    },
    ...sharedConfig,
  },
];
