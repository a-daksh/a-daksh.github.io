/**
 * Gatsby SSR APIs: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-ssr/
 */
const React = require('react');

// Runs before first paint: apply the visitor's saved theme so light-mode users never see a flash
// of the dark theme. Must stay in sync with THEME_STORAGE_KEY in src/contexts/ThemeContext.js.
const themeScript = `
(function () {
  var theme = 'dark';
  try {
    if (window.localStorage.getItem('theme') === 'light') theme = 'light';
  } catch (e) {}
  document.documentElement.dataset.theme = theme;
})();
`;

exports.onRenderBody = ({ setHeadComponents, setHtmlAttributes }) => {
  setHtmlAttributes({ lang: 'en', 'data-theme': 'dark' });
  setHeadComponents([
    // eslint-disable-next-line react/no-danger
    <script key="theme-init" dangerouslySetInnerHTML={{ __html: themeScript }} />,
  ]);
};
