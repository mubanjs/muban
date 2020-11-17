module.exports = {
  title: 'Muban',
  description: 'Writing components for server-rendered HTML',
  base: '/muban-component/',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'Api', link: '/api/' },
      { text: 'Research', link: '/research/' },
    ],
    repo: 'mediamonks/muban-component',
    docsDir: 'docs',
    // displayAllHeaders: true,
    sidebarDepth: 2,
    sidebar: {
      '/research/': [
        '',
        'lifecycle',
        'component-props',
        'component-refs',
        'component-dynamic-templates',
        'reactivity',
        'pure-rendering',
      ],

      '/api/': [
        '',
        'component',
        'props',
        'refs',
        'bindings',
        // 'hooks',
      ],

      '/guide/': [
        '',
        'reactivity',
        'bindings',
        'template',
      ],

      // fallback
      '/': [
        '',        /* / */
      ]
    }
  }
}
