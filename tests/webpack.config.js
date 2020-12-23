const path = require('path');

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, './component-init/index.ts'),
  output: {
    path: path.resolve(__dirname, 'dist/component-init/'),
    filename: 'bundle.js',
  },
  devServer: {
    contentBase: path.resolve(__dirname, './component-init'),
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'postcss-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
};
