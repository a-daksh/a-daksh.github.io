/**
 * Gatsby Node APIs: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/
 */
const path = require('path');

exports.onCreateWebpackConfig = ({ stage, actions }) => {
  // Don't ship source maps to production (they double the deploy size and expose local paths).
  if (stage === 'build-javascript') {
    actions.setWebpackConfig({ devtool: false });
  }

  // Import aliases, e.g. `import { Layout } from '@components'`.
  actions.setWebpackConfig({
    resolve: {
      alias: {
        '@components': path.resolve(__dirname, 'src/components'),
        '@config': path.resolve(__dirname, 'src/config'),
        '@contexts': path.resolve(__dirname, 'src/contexts'),
        '@fonts': path.resolve(__dirname, 'src/fonts'),
        '@hooks': path.resolve(__dirname, 'src/hooks'),
        '@images': path.resolve(__dirname, 'src/images'),
        '@styles': path.resolve(__dirname, 'src/styles'),
        '@utils': path.resolve(__dirname, 'src/utils'),
      },
    },
  });
};

// Explicit content types so optional frontmatter fields (e.g. `video`, `url`) resolve
// as files/strings even when no markdown file currently uses them.
exports.createSchemaCustomization = ({ actions }) => {
  actions.createTypes(`
    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
    }
    type Frontmatter {
      cover: File @fileByRelativePath
      video: File @fileByRelativePath
      url: String
      github: String
      external: String
      tech: [String]
      label: String # featured projects: line above the title (lab, course, capstone...)
    }
  `);
};
