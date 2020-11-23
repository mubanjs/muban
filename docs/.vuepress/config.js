module.exports = {
  title: 'Muban',
  description: 'Writing components for server-rendered HTML',
  base: '/muban/',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'Api', link: '/api/' },
      { text: 'Research', link: '/research/' },
    ],
    repo: 'mubanjs/muban',
    docsDir: 'docs',
    // displayAllHeaders: true,
    sidebarDepth: 2,
    sidebar: {

      '/guide/': [
        '', // getting started
        'component',
        'reactivity',
        'bindings',
        'template',
      ],

      '/api/': [
        '',
        'component',
        'props',
        'refs',
        'bindings',
        'hooks',
        'provide-inject',
        'mhtml',
      ],

      '/research/': [
        '',
        'lifecycle',
        'component-props',
        'component-refs',
        'component-dynamic-templates',
        'reactivity',
        'pure-rendering',
      ],

      // fallback
      '/': [
        '',        /* / */
      ]
    }
  }
}
