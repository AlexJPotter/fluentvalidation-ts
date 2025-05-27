import { themes as prismThemes } from 'prism-react-renderer';

export default {
  title: 'fluentvalidation-ts',
  titleDelimiter: '·',
  tagline: 'Strong, simple, extensible validation.',
  url: 'https://fluentvalidation-ts.alexpotter.dev',
  baseUrl: '/',
  organizationName: 'AlexJPotter',
  projectName: 'fluentvalidation-ts',
  noIndex: false,
  scripts: [
    'https://buttons.github.io/buttons.js',
    'https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js',
    '/js/code-block-buttons.js',
  ],
  stylesheets: ['/css/code-block-buttons.css'],
  favicon: 'img/favicon.ico',
  customFields: {
    search: true,
    users: [],
    repoUrl: 'https://github.com/alexjpotter/fluentvalidation-ts',
    disableHeaderTitle: true,
  },
  onBrokenLinks: 'log',
  onBrokenMarkdownLinks: 'log',
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          showLastUpdateAuthor: false,
          showLastUpdateTime: true,
          path: '../docs',
          sidebarPath: './sidebars.json',
        },
        blog: false,
        theme: {
          customCss: './src/css/customTheme.css',
        },
      },
    ],
  ],
  plugins: [],
  themeConfig: {
    algolia: {
      appId: 'GQN7MVBZD5',
      apiKey: 'abd6e3438533f74ae866e825467bf51f', // NOTE: This is a public API key, not a secret key - it is safe to commit this :)
      indexName: 'fluentvalidation-ts',
      searchPagePath: 'search',
      contextualSearch: true,
      insights: true,
    },
    prism: {
      theme: prismThemes.vsLight,
      darkTheme: prismThemes.nightOwl,
    },
    navbar: {
      title: 'fluentvalidation-ts',
      logo: {
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'html',
          position: 'left',
          value: '<div class="margin-right--sm"></div>',
        },
        {
          to: 'docs/overview',
          label: 'Docs',
          position: 'left',
        },
        {
          to: '/help',
          label: 'Help',
          position: 'left',
        },
        {
          href: 'https://github.com/alexjpotter/fluentvalidation-ts',
          label: 'GitHub',
          position: 'right',
        },
        {
          type: 'html',
          position: 'right',
          value: '<div class="margin-right--sm"></div>',
        },
      ],
    },
    image: 'img/logo-outlined.svg',
    footer: {
      links: [],
      copyright: 'Copyright © 2025 Alex Potter. All rights reserved.',
    },
  },
};
