/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

// List of projects/orgs using your project for the users page.
const users = [
  // {
  //   caption: 'User1',
  //   // You will need to prepend the image path with your baseUrl
  //   // if it is not '/', like: '/test-site/img/image.jpg'.
  //   image: '/img/undraw_open_source.svg',
  //   infoLink: 'https://www.facebook.com',
  //   pinned: true,
  // },
];

const siteConfig = {
  title: 'fluentvalidation-ts', // Title for your website.
  tagline: `Strong, simple, extensible validation.`,
  url: 'https://alexpotter.dev', // Your website URL
  baseUrl: '/fluentvalidation-ts/', // Base URL for your project */
  // For github.io type URLs, you would set the url and baseUrl like:
  //   url: 'https://facebook.github.io',
  //   baseUrl: '/test-site/',

  // Used for publishing and more
  projectName: 'fluentvalidation-ts',
  organizationName: 'AlexJPotter',
  // For top-level user or org sites, the organization is still the same.
  // e.g., for the https://JoelMarcey.github.io site, it would be set like...
  //   organizationName: 'JoelMarcey'

  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [
    { doc: 'overview', label: 'Docs' },
    { page: 'help', label: 'Help' },
    {
      href: 'https://github.com/alexjpotter/fluentvalidation-ts',
      label: 'GitHub',
    },
    // { blog: true, label: 'Blog' },
  ],
  noIndex: false,
  search: true,

  // If you have users set above, you add it here:
  users,

  /* path to images for header/footer */
  headerIcon: 'img/logo-text.svg',
  footerIcon: 'img/logo-outlined.svg',
  favicon: 'img/favicon.ico',

  /* Colors for website */
  colors: {
    primaryColor: '#141c2f',
    secondaryColor: '#233152',
  },

  /* Custom fonts for website */
  /*
  fonts: {
    myFont: [
      "Times New Roman",
      "Serif"
    ],
    myOtherFont: [
      "-apple-system",
      "system-ui"
    ]
  },
  */

  // This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
  copyright: `Copyright © ${new Date().getFullYear()} Alex Potter. All Rights Reserved.`,

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks.
    theme: 'default',
  },
  usePrism: ['jsx', 'typescript'],

  // Add custom scripts here that would be placed in <script> tags.
  scripts: [
    'https://buttons.github.io/buttons.js',
    'https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js',
    '/fluentvalidation-ts/js/code-block-buttons.js',
  ],

  stylesheets: ['/fluentvalidation-ts/css/code-block-buttons.css'],

  // On page navigation for the current documentation page.
  onPageNav: 'separate',
  // No .html extensions for paths.
  cleanUrl: true,

  // Open Graph and Twitter card images.
  ogImage: 'img/logo-outlined.svg',
  twitterImage: 'img/logo-outlined.svg',

  // For sites with a sizable amount of content, set collapsible to true.
  // Expand/collapse the links and subcategories under categories.
  // docsSideNavCollapsible: true,

  // Show documentation's last contributor's name.
  // enableUpdateBy: true,

  // Show documentation's last update time.
  // enableUpdateTime: true,

  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  repoUrl: 'https://github.com/alexjpotter/fluentvalidation-ts',

  scrollToTop: true,
  scrollToTopOptions: {
    zIndex: 100,
  },
  disableHeaderTitle: true,

  twitterUsername: 'ajp_dev',
};

module.exports = siteConfig;
