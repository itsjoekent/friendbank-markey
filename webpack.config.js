const path = require('path');

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
    },
    ...sharedConfig,
  },
  {
    entry: './src/frontend/ssr.js',
    target: 'node',
    output: {
      filename: 'ssr.js',
      path: path.join(__dirname, 'src/api'),
      libraryTarget: 'commonjs2',
    },
    ...sharedConfig,
  },
];

// module.exports = {
//   entry: {
//     app: './src/frontend/index.js',
//     ssr: './src/frontend/ssr.js'
//   },
//   output: {
//     filename: '[name].js',
//     path: path.join(__dirname, 'public/dist'),
//   },
//   module: {
//     rules: [
//       {
//         test: /\.m?js$/,
//         exclude: /(node_modules|bower_components)/,
//         use: {
//           loader: 'babel-loader',
//         },
//       },
//     ],
//   },
// };
