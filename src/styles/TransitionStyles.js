import { css } from 'styled-components';

/*
 * Intro animations, CSS only. Content is server-rendered and visible to crawlers and screen readers
 * from the start; these classes just fade it in on first paint. Stagger items with the
 * --intro-delay custom property, e.g. style={{ '--intro-delay': '300ms' }}.
 */
const TransitionStyles = css`
  @keyframes intro-up {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }

  @keyframes intro-down {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }

  @keyframes intro-fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .intro-up,
  .intro-down,
  .intro-fade {
    animation-duration: 400ms;
    animation-timing-function: var(--easing);
    animation-fill-mode: both;
    animation-delay: var(--intro-delay, 0ms);
  }
  .intro-up {
    animation-name: intro-up;
  }
  .intro-down {
    animation-name: intro-down;
  }
  .intro-fade {
    animation-name: intro-fade;
  }

  @media (prefers-reduced-motion: reduce) {
    .intro-up,
    .intro-down,
    .intro-fade {
      animation: none;
    }
  }
`;

export default TransitionStyles;
