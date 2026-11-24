/**
 * Gatsby config: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/
 * The site is deployed at the domain root (https://a-daksh.github.io), so no pathPrefix.
 */
const SITE_URL = 'https://a-daksh.github.io';
const BG_DARK = '#1E201E'; // keep in sync with --color-bg-primary in src/styles/GlobalStyle.js

module.exports = {
  siteMetadata: {
    title: 'Daksh Adhar',
    description:
      'Hi! I am Daksh Adhar, an AI Engineer at Foundation Robotics working on robot learning. Welcome to my website!',
    siteUrl: SITE_URL,
    image: '/og.png',
    author: 'Daksh Adhar',
    keywords:
      'Daksh Adhar, robotics engineer, robot learning, reinforcement learning, dexterous manipulation, AI Engineer, Foundation Robotics, portfolio',
  },
  plugins: [
    'gatsby-plugin-styled-components',
    'gatsby-plugin-image',
    {
      resolve: 'gatsby-plugin-sharp',
      options: {
        defaults: {
          formats: ['auto', 'webp'],
          quality: 82,
          placeholder: 'dominantColor',
        },
      },
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sitemap',
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        sitemap: `${SITE_URL}/sitemap-index.xml`,
        policy: [{ userAgent: '*', allow: '/' }],
      },
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'Daksh Adhar',
        short_name: 'Daksh Adhar',
        start_url: '/',
        background_color: BG_DARK,
        theme_color: BG_DARK,
        display: 'minimal-ui',
        icon: 'src/images/favicon.png',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: { name: 'images', path: `${__dirname}/src/images` },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: { name: 'content', path: `${__dirname}/content/` },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            // Links inside markdown content open in a new tab, safely.
            resolve: 'gatsby-remark-external-links',
            options: { target: '_blank', rel: 'noopener noreferrer' },
          },
        ],
      },
    },
  ],
};
