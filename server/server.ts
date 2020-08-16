/* eslint-disable @typescript-eslint/no-explicit-any */
import path from 'path';
import express from 'express';
import cors from 'cors';
// const morgan = require('morgan');
import { logger } from '@storybook/node-logger';
import exphbs from 'express-handlebars';

import webpack from 'webpack';
import devMiddleware from 'webpack-dev-middleware';
import hotMiddleware from 'webpack-hot-middleware';

const publicPath = 'http://localhost:1338/';
const hmrPath = '__hmr__';

const compiler = webpack({
  mode: 'development',
  entry: [
    path.resolve(__dirname, '../examples/src/templates.ts'),
    `webpack-hot-middleware/client?path=${publicPath}${hmrPath}&reload=true`,
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: publicPath,
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
  plugins: [new webpack.HotModuleReplacementPlugin()],
});
import { html } from 'lit-ntml';
import typedObjectEntries from '../examples/src/type-utils/typedObjectEntries';

const port = process.env.PORT || 8080;

const app = express();
app.use(cors());
app.engine('handlebars', exphbs());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.use(
  devMiddleware(compiler, {
    publicPath,
  }),
);
app.use(
  hotMiddleware(compiler, {
    path: `/${hmrPath}`,
  }),
);

app.get('/', (req, res) => res.send('Hello World!'));

const parseQueryProps = (obj: Record<string, any>) => {
  return typedObjectEntries(obj).reduce((acc, [key, value]) => {
    if (/is[A-Z]/g.test(key)) {
      acc[key] = Boolean(value === 'true') as any;
    }
    return acc;
  }, {} as Record<string, string>);
};

app.get(/storybook_preview\/(.*)/, async (req, res, next) => {
  const path = req.params[0];
  if (path.includes('hot-update.json')) {
    return next();
  }
  const props = parseQueryProps(req.query);
  console.log('props', props);

  const content = await html`${(
    await import('../examples/src/components/toggle-expand/ToggleExpand.template')
  ).template(props)}`;

  res.render('index', { component: path, content });
});

app.listen(port, () => logger.info(`Server listening on port ${port}!`));

export default app;
