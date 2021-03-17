var path = require('path');

module.exports = ({ config }) => {
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.resolve.alias,
      '@muban/muban': path.resolve(__filename, './../../src')
    }
  }

  // remove this rule that deals with svgs
  config.module.rules = config.module.rules.filter(rule => !String(rule.test).includes('svg'));
  // add the rule back without the svg in it, jep, a bit hacky
  config.module.rules.push({
    test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani|pdf)(\?.*)?$/,
    loader: require.resolve('file-loader'),
    options: {
      name: 'static/media/[name].[hash:8].[ext]',
      esModule: false,
    },
  });

  // Add a loader for the svg's
  config.module.rules.push({
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
  });

  // Return the altered config
  return config;
};
