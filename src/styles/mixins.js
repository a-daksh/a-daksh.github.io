import { css } from 'styled-components';

const button = css`
  color: var(--color-accent);
  background-color: transparent;
  border: 1px solid var(--color-accent);
  border-radius: var(--border-radius);
  font-size: var(--fz-xs);
  font-family: var(--font-mono);
  line-height: 1;
  text-decoration: none;
  cursor: pointer;
  transition: var(--transition);
  padding: 1.25rem 1.75rem;

  &:hover,
  &:active {
    background-color: var(--color-accent-tint);
  }
`;

const mixins = {
  flexCenter: css`
    display: flex;
    justify-content: center;
    align-items: center;
  `,

  flexBetween: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,

  link: css`
    display: inline-block;
    text-decoration: none;
    text-decoration-skip-ink: auto;
    color: inherit;
    position: relative;
    transition: var(--transition);
    cursor: pointer;
    &:hover,
    &:active,
    &:focus-visible {
      color: var(--color-accent);
    }
  `,

  // Links inside running text: always faintly underlined (so they read as links), solid on hover.
  // Plain inline text-decoration wraps correctly across lines, unlike a pseudo-element underline.
  inlineLink: css`
    display: inline;
    color: var(--color-accent);
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 0.2em;
    text-decoration-color: currentColor; /* fallback for browsers without color-mix() */
    text-decoration-color: color-mix(in srgb, currentColor 35%, transparent);
    text-decoration-skip-ink: auto;
    transition: text-decoration-color 0.25s var(--easing);
    cursor: pointer;
    &:hover,
    &:focus-visible,
    &:active {
      text-decoration-color: currentColor;
    }
  `,

  button,

  smallButton: css`
    color: var(--color-accent);
    background-color: transparent;
    border: 1px solid var(--color-accent);
    border-radius: var(--border-radius);
    padding: 0.75rem 1rem;
    font-size: var(--fz-xs);
    font-family: var(--font-mono);
    line-height: 1;
    text-decoration: none;
    cursor: pointer;
    transition: var(--transition);
    &:hover,
    &:active {
      background-color: var(--color-accent-tint);
    }
  `,

  bigButton: css`
    color: var(--color-accent);
    background-color: transparent;
    border: 1px solid var(--color-accent);
    border-radius: var(--border-radius);
    padding: 1.25rem 1.75rem;
    font-size: var(--fz-sm);
    font-family: var(--font-mono);
    line-height: 1;
    text-decoration: none;
    cursor: pointer;
    transition: var(--transition);
    &:hover {
      background-color: var(--color-accent-tint);
      transform: translateY(-3px);
      box-shadow: 0 10px 30px -15px var(--color-shadow);
    }
    &:active {
      background-color: var(--color-accent-tint);
      transform: translateY(-1px);
      box-shadow: 0 5px 15px -10px var(--color-shadow);
    }
  `,

  boxShadow: css`
    box-shadow: 0 10px 30px -15px var(--color-shadow);
    transition: var(--transition);

    &:hover,
    &:focus {
      box-shadow: 0 20px 30px -15px var(--color-shadow);
    }
  `,

  fancyList: css`
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
  `,
};

export default mixins;
