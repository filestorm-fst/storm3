const path = require('path');


const moduleRules = {
  rules: [
    {
      test: /\.js$/,
      use: [
        {
          loader: 'babel-loader',
        }
      ],
      exclude: /node_modules/,
    },
  ]
};
const mode = 'production';

module.exports = [
  {
    mode,
    devtool: 'source-map',
    entry: {
      index: './project/storm3/export.js',
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'Storm3.min.js',
      library: 'Storm3',
      libraryTarget: 'umd',
      umdNamedDefine: true
    },
    module: moduleRules,
  }
];
