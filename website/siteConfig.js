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
  {
    caption: 'User1',
    // You will need to prepend the image path with your baseUrl
    // if it is not '/', like: '/test-site/img/docusaurus.svg'.
    image: '/img/docusaurus.svg',
    infoLink: 'https://www.facebook.com',
    pinned: true,
  },
];

const siteConfig = {
  title: '华炎开发', // Title for your website.
  tagline: '只需编写少量代码，就能构建功能强大的企业应用。',
  url: 'https://steedos.github.io/', // Your website URL
  baseUrl: '/', // Base URL for your project */
  // For github.io type URLs, you would set the url and baseUrl like:
  //   url: 'https://facebook.github.io',
  //   baseUrl: '/test-site/',

  // Used for publishing and more
  projectName: 'steedos.github.io',
  organizationName: 'steedos',
  // For top-level user or org sites, the organization is still the same.
  // e.g., for the https://JoelMarcey.github.io site, it would be set like...
  //   organizationName: 'JoelMarcey'

  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [
    {doc: 'overview', label: '特色'},
    {doc: 'getting_started', label: '文档'},
    {doc: 'projects', label: '案例'},
    //{doc: 'record_list', label: '用户手册'},
    //{doc: 'api', label: 'API'},
    //{blog: true, label: '动态'},
    // {
    //   href: 'https://github.com/steedos/',
    //   label: '开源',
    // },
  ],

  // If you have users set above, you add it here:
  users,
  editUrl: 'https://github.com/steedos/object-server/edit/develop/docs/',
  /* path to images for header/footer */
  headerIcon: 'img/icon_blue.png',
  footerIcon: 'img/icon_blue.png',
  favicon: 'img/icon_blue.png',

  /* Colors for website */
  colors: {
    primaryColor: 'rgba(0, 0, 0, 0.8)',
    secondaryColor: 'rgba(34,34,34,0.8)',
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
  copyright: `Copyright © ${new Date().getFullYear()} 上海华炎软件科技有限公司`,

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks.
    //theme: 'atom-one-dark',
  },

  // Add custom scripts here that would be placed in <script> tags.
  scripts: [],

  // On page navigation for the current documentation page.
  onPageNav: 'separate',
  // No .html extensions for paths.
  cleanUrl: true,

  // Open Graph and Twitter card images.
  ogImage: 'img/docusaurus.png',
  twitterImage: 'img/docusaurus.png',

  // Show documentation's last contributor's name.
  // enableUpdateBy: true,

  // Show documentation's last update time.
  // enableUpdateTime: true,

  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  repoUrl: 'https://github.com/steedos/object-server',
  scrollToTop: true,
  enableUpdateTime: true,
  enableUpdateBy: true,
  docsSideNavCollapsible: true,

  algolia: {
    apiKey: 'eaa8e1c86ac084b5cac664d9d996856c',
    indexName: 'steedos',
    algoliaOptions: {} // Optional, if provided by Algolia
  },
};

module.exports = siteConfig;
