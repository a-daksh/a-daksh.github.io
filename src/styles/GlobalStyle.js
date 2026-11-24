import { createGlobalStyle } from 'styled-components';
import bgDark from '@images/bg-dark.webp';
import bgLight from '@images/bg-light.webp';
import Fonts from './fonts';
import TransitionStyles from './TransitionStyles';

/*
 * Theme colours live here as CSS variables. Dark is the default; the light palette applies when
 * <html data-theme="light"> is set. gatsby-ssr.js sets that attribute before first paint (from the
 * visitor's saved choice), and ThemeContext flips it when the toggle is used.
 */
const GlobalStyle = createGlobalStyle`
  ${Fonts};

  :root {
    color-scheme: dark;

    --color-bg-primary: #1E201E;      /* page background */
    --color-bg-primary-rgb: 30, 32, 30;
    --color-bg-secondary: #ECDFCC;    /* cards, panels */
    --color-bg-tertiary: #ECDFCC;     /* lines, subtle backgrounds */

    --color-shadow: rgba(30, 32, 30, 0.7);

    --color-accent: #fff;
    --color-accent-tint: rgba(255, 255, 255, 0.1);

    --color-text-primary: #fff;
    --color-text-secondary: #ECDFCC;
    --color-text-tertiary: #ECDFCC;
    --color-text-inverse: #1E201E;

    --bg-image-url: url(${bgDark});
    --bg-overlay: rgba(30, 32, 30, 0.8);

    --font-sans: 'Calibre', 'San Francisco', 'SF Pro Text', -apple-system, system-ui, sans-serif;
    --font-mono: 'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace;

    --fz-xxs: 12px;
    --fz-xs: 13px;
    --fz-sm: 14px;
    --fz-md: 16px;
    --fz-lg: 18px;
    --fz-xl: 20px;
    --fz-xxl: 22px;
    --fz-heading: 32px;

    --border-radius: 4px;
    --nav-height: 75px;
    --nav-scroll-height: 70px;

    --tab-height: 42px;
    --tab-width: 120px;

    --easing: cubic-bezier(0.645, 0.045, 0.355, 1);
    --transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);

    --hamburger-width: 30px;

    --ham-before: top 0.1s ease-in 0.25s, opacity 0.1s ease-in;
    --ham-before-active: top 0.1s ease-out, opacity 0.1s ease-out 0.12s;
    --ham-after: bottom 0.1s ease-in 0.25s, transform 0.22s cubic-bezier(0.55, 0.055, 0.675, 0.19);
    --ham-after-active: bottom 0.1s ease-out, transform 0.22s cubic-bezier(0.215, 0.61, 0.355, 1) 0.12s;
  }

  :root[data-theme='light'] {
    color-scheme: light;

    --color-bg-primary: #ECDFCC;
    --color-bg-primary-rgb: 236, 223, 204;
    --color-bg-secondary: #1E201E;
    --color-bg-tertiary: #1E201E;

    --color-accent: #1E201E;
    --color-accent-tint: rgba(0, 0, 0, 0.1);

    --color-text-primary: #1E201E;
    --color-text-secondary: #323232;
    --color-text-tertiary: #323232;
    --color-text-inverse: #ECDFCC;

    --bg-image-url: url(${bgLight});
    --bg-overlay: rgba(236, 223, 204, 0.8);
  }

  /*
   * Desktop renders at 90% scale (the site's preferred density, like Chrome zoom at 90%).
   * CSS zoom also shrinks vh units, so use var(--full-height) instead of 100vh for "one screen tall".
   */
  :root {
    --full-height: 100vh;
  }
  @media (min-width: 1081px) {
    html {
      zoom: 0.9;
    }
    :root {
      --full-height: calc(100vh / 0.9);
    }
  }

  html {
    box-sizing: border-box;
    width: 100%;
    background-color: var(--color-bg-primary);
    scroll-behavior: smooth;
    scrollbar-width: thin;
    scrollbar-color: var(--color-bg-secondary) transparent;

    @media (prefers-reduced-motion: reduce) {
      scroll-behavior: auto;
    }
  }

  /* One visible keyboard-focus style for every interactive element. */
  :focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 3px;
  }

  /* Text for screen readers only. */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  /* Scrollbar Styles */
  ::-webkit-scrollbar {
    width: 12px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background-color: var(--color-bg-secondary);
    border: 3px solid var(--color-bg-primary);
    border-radius: 10px;
  }

  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }

  ::selection {
    background-color: var(--color-text-tertiary);
    color: var(--color-bg-primary);
  }

  ::-moz-selection {
    background-color: var(--color-text-tertiary);
    color: var(--color-bg-primary);
  }

  body {
    margin: 0;
    width: 100%;
    min-height: 100%;
    overflow-x: hidden;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    position: relative;

    /* No background here: the schematic image is painted by body::before (z-index -2), which must
       sit above the page colour set on <html>. */
    color: var(--color-text-tertiary);
    font-family: var(--font-sans);
    font-size: var(--fz-xl);
    line-height: 1.3;

    &::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      /* The image is pre-blurred (no live CSS blur, which repainted on every scroll). */
      background-image: var(--bg-image-url);
      background-size: cover;
      background-position: center;
      z-index: -2;
    }

    &::after {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: var(--bg-overlay);
      z-index: -1;
    }

    @media (max-width: 480px) {
      font-size: var(--fz-lg);
    }

    &.hidden {
      overflow: hidden;
    }

    &.blur {
      overflow: hidden;

      header {
        background-color: transparent;
      }

      #content > * {
        filter: blur(5px) brightness(0.7);
        transition: var(--transition);
        pointer-events: none;
        user-select: none;
      }
    }
  }

  #root {
    min-height: var(--full-height);
    display: grid;
    grid-template-rows: 1fr auto;
    grid-template-columns: 100%;
  }

  main {
    margin: 0 auto;
    width: 100%;
    max-width: 1600px;
    min-height: var(--full-height);
    padding: 200px 150px;

    @media (max-width: 1080px) {
      padding: 200px 100px;
    }
    @media (max-width: 768px) {
      padding: 150px 50px;
    }
    @media (max-width: 480px) {
      padding: 125px 25px;
    }

    &.fillHeight {
      padding: 0 150px;

      @media (max-width: 1080px) {
        padding: 0 100px;
      }
      @media (max-width: 768px) {
        padding: 0 50px;
      }
      @media (max-width: 480px) {
        padding: 0 25px;
      }
    }
  }

  section {
    margin: 0 auto;
    padding: 100px 0;
    max-width: 1000px;
    scroll-margin-top: var(--nav-height);

    @media (max-width: 768px) {
      padding: 80px 0;
    }

    @media (max-width: 480px) {
      padding: 40px 0;
    }
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0 0 10px 0;
    font-weight: 600;
    color: var(--color-text-primary);
    line-height: 1.1;
  }

  .big-heading {
    margin: 0;
    font-size: clamp(40px, 8vw, 80px);
  }

  .medium-heading {
    margin: 0;
    font-size: clamp(40px, 8vw, 60px);
  }

  .numbered-heading {
    display: flex;
    align-items: center;
    position: relative;
    margin: 10px 0 40px;
    width: 100%;
    font-size: clamp(26px, 5vw, var(--fz-heading));
    white-space: nowrap;

    &:before {
      position: relative;
      bottom: 4px;
      counter-increment: section;
      content: '0' counter(section) '.';
      margin-right: 10px;
      color: var(--color-accent);
      font-family: var(--font-mono);
      font-size: clamp(var(--fz-md), 3vw, var(--fz-xl));
      font-weight: 400;

      @media (max-width: 480px) {
        margin-bottom: -3px;
        margin-right: 5px;
      }
    }

    &:after {
      content: '';
      display: block;
      position: relative;
      top: -5px;
      width: 300px;
      height: 1px;
      margin-left: 20px;
      background-color: var(--color-bg-tertiary);

      @media (max-width: 1080px) {
        width: 200px;
      }
      @media (max-width: 768px) {
        width: 100%;
      }
      @media (max-width: 600px) {
        margin-left: 10px;
      }
    }
  }

  img,
  svg,
  .gatsby-image-wrapper {
    width: 100%;
    max-width: 100%;
    vertical-align: middle;
  }

  svg {
    width: 100%;
    height: 100%;
    fill: currentColor;
    vertical-align: middle;

    &.feather {
      fill: none;
    }
  }

  a {
    display: inline-block;
    text-decoration: none;
    text-decoration-skip-ink: auto;
    color: var(--color-accent);
    position: relative;
    transition: var(--transition);
    cursor: pointer;

    &:hover,
    &:focus {
      color: var(--color-accent);
    }

    &.inline-link {
      ${({ theme }) => theme.mixins.inlineLink};
    }
  }

  button {
    cursor: pointer;
    border: 0;
    border-radius: 0;
  }
  
  /* Auto-blur buttons after click to prevent sticky hover */
  button:focus:not(:focus-visible) {
    outline: none;
  }

  input, textarea {
    border-radius: 0;
    outline: 0;

    &:focus {
      outline: 0;
    }
    &:focus,
    &:active {
      &::placeholder {
        opacity: 0.5;
      }
    }
  }

  p {
    margin: 0 0 15px 0;

    &:last-child,
    &:last-of-type {
      margin: 0;
    }

    & > a {
      ${({ theme }) => theme.mixins.inlineLink};
    }

    & > code {
      background-color: var(--color-bg-tertiary);
      color: var(--color-accent);
      font-size: var(--fz-sm);
      border-radius: var(--border-radius);
      padding: 0.3em 0.5em;
    }
  }

  ul {
    &.fancy-list {
      padding: 0;
      margin: 0;
      list-style: none;
      font-size: var(--fz-lg);
      li {
        position: relative;
        padding-left: 30px;
        margin-bottom: 10px;
        &:before {
          content: '▹';
          position: absolute;
          left: 0;
          color: var(--color-accent);
        }
      }
    }
  }

  blockquote {
    border-left-color: var(--color-accent);
    border-left-style: solid;
    border-left-width: 1px;
    margin-left: 0px;
    margin-right: 0px;
    padding-left: 1.5rem;

    p {
      font-style: italic;
      font-size: 24px;
    }
  }

  hr {
    background-color: var(--color-bg-tertiary);
    height: 1px;
    border-width: 0px;
    border-style: initial;
    border-color: initial;
    border-image: initial;
    margin: 1rem;
  }

  code {
    font-family: var(--font-mono);
    font-size: var(--fz-md);
  }

  #logo {
    color: var(--color-accent);
  }

  .overline {
    color: var(--color-accent);
    font-family: var(--font-mono);
    font-size: var(--fz-md);
    font-weight: 400;
  }

  .subtitle {
    color: var(--color-accent);
    margin: 0 0 20px 0;
    font-size: var(--fz-md);
    font-family: var(--font-mono);
    font-weight: 400;
    line-height: 1.5;
    @media (max-width: 1080px) {
      font-size: var(--fz-sm);
    }
    @media (max-width: 768px) {
      font-size: var(--fz-xs);
    }

    a {
      ${({ theme }) => theme.mixins.inlineLink};
      line-height: 1.5;
    }
  }

  .breadcrumb {
    display: flex;
    align-items: center;
    margin-bottom: 50px;
    color: var(--color-accent);

    .arrow {
      display: block;
      margin-right: 10px;
      padding-top: 4px;
    }

    a {
      ${({ theme }) => theme.mixins.inlineLink};
      font-family: var(--font-mono);
      font-size: var(--fz-sm);
      font-weight: 600;
      line-height: 1.5;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
  }

  .gatsby-image-outer-wrapper {
    height: 100%;
  }

  ${TransitionStyles};
`;

export default GlobalStyle;
