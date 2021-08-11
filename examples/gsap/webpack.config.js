const path = require('path');

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, './src/index.ts'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  devServer: {
    contentBase: path.resolve(__dirname, './dist'),
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
        test: /\.scss$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              additionalData: '@import "/examples/src/style/_global.scss";',
            }
          },
        ],
      },
      {
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani|pdf)(\?.*)?$/,
        loader: require.resolve('file-loader'),
        options: {
          name: 'static/media/[name].[hash:8].[ext]',
          esModule: false,
        },
      },
      {
        test: /\.svg$/,
        oneOf: (() => {
          const svgoLoaderConfig = {
            loader: 'svgo-loader',
            options: {
              plugins: [
                { removeStyleElement: true },
                { removeComments: true },
                { removeDesc: true },
                { removeUselessDefs: true },
                { removeTitle: true },
                { removeMetadata: true },
                { removeComments: true },
                { cleanupIDs: { remove: true, prefix: '' } },
                { convertColors: { shorthex: false } },
              ],
            },
          };

          return [
            {
              resourceQuery: /inline/,
              use: [{ loader: 'svg-inline-loader' }, svgoLoaderConfig],
            },
            {
              use: [{ loader: 'url-loader' }, svgoLoaderConfig],
            },
          ];
        })(),
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
};
