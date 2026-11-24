import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { usePrefersReducedMotion } from '@hooks';
import HeroRobot from '../heroRobot';

// From this width the headline and the 3D robot sit side by side; below it they stack.
const SIDE_BY_SIDE_BP = 1440;

const WORDS = ['Robots.', 'cool stuff.'];
const LONGEST_WORD = WORDS.reduce((a, b) => (b.length > a.length ? b : a));

const StyledHeroSection = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: var(--full-height);
  padding-top: var(--nav-height);

  @media (min-width: ${SIDE_BY_SIDE_BP}px) {
    display: grid;
    grid-template-columns: max-content minmax(0, 1fr);
    align-items: center;
    column-gap: 40px;
    max-width: none;
    /* Start the text on the same left edge as the 1000px section column below. */
    padding-left: max(0px, calc((100% - 1000px) / 2));
  }

  .hero-text {
    position: relative;
    z-index: 2;
  }

  .greeting {
    margin: 0 0 30px 4px;
    color: var(--color-accent);
    font-family: var(--font-mono);
    font-size: clamp(var(--fz-sm), 5vw, var(--fz-md));
    font-weight: 400;

    @media (max-width: 480px) {
      margin: 0 0 20px 2px;
    }
  }

  h1 {
    margin-top: 0.2em;
    color: var(--color-text-primary);
    line-height: 0.9;
  }

  h2 {
    margin-top: 10px;
    color: var(--color-text-tertiary);
    line-height: 0.9;
  }

  /* The typed word sits in a slot already as wide as the longest word, so typing never
     re-wraps the line or moves the robot below it. */
  .typewriter {
    display: inline-grid;

    > span {
      grid-area: 1 / 1;
      white-space: nowrap;
    }
    .sizer {
      visibility: hidden;
    }
    .typed {
      justify-self: start;
      border-right: 2px solid var(--color-accent);
      animation: blink 1s step-end infinite;
    }
  }

  @keyframes blink {
    50% {
      border-color: transparent;
    }
  }

  .hero-stage {
    width: 100%;
    height: min(46vh, 480px);
    margin-top: 24px;

    @media (min-width: ${SIDE_BY_SIDE_BP}px) {
      height: min(72vh, 680px);
      margin-top: 0;
      margin-right: -70px;
      width: calc(100% + 70px);
    }
  }
`;

/** Types and deletes WORDS in a loop, starting with the first word already shown. */
const useTypewriter = enabled => {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState(WORDS[0]);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }
    const word = WORDS[wordIndex];
    let delay = deleting ? 50 : 100;
    let step;

    if (!deleting && text === word) {
      delay = 2500; // hold the full word
      step = () => setDeleting(true);
    } else if (deleting && text === '') {
      step = () => {
        setDeleting(false);
        setWordIndex((wordIndex + 1) % WORDS.length);
      };
    } else {
      step = () => setText(deleting ? text.slice(0, -1) : word.slice(0, text.length + 1));
    }

    const timer = setTimeout(step, delay);
    return () => clearTimeout(timer);
  }, [enabled, text, deleting, wordIndex]);

  return text;
};

const Hero = () => {
  const reducedMotion = usePrefersReducedMotion();
  const typed = useTypewriter(!reducedMotion);

  return (
    <StyledHeroSection id="top">
      <div className="hero-text">
        <p className="greeting intro-up" style={{ '--intro-delay': '100ms' }}>
          Hi, my name is
        </p>
        <h1 className="big-heading intro-up" style={{ '--intro-delay': '200ms' }}>
          Daksh Adhar
        </h1>
        <h2 className="big-heading intro-up" style={{ '--intro-delay': '300ms' }}>
          I like building{' '}
          <span className="typewriter" aria-hidden="true">
            <span className="sizer">{LONGEST_WORD}</span>
            <span className="typed">{typed}</span>
          </span>
          <span className="sr-only">robots and cool stuff.</span>
        </h2>
      </div>

      <div className="hero-stage">
        <HeroRobot />
      </div>
    </StyledHeroSection>
  );
};

export default Hero;
