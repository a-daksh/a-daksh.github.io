import React, { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import { email } from '@config';
import { navDelay, loaderDelay } from '@utils';

const StyledHeroSection = styled.section`
  ${({ theme }) => theme.mixins.flexCenter};
  flex-direction: column;
  align-items: flex-start;
  min-height: 100vh;

  p {
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
    margin: 0;
    color: var(--color-text-primary);
    line-height: 0.9;
  }

  h2 {
    margin-top: 10px;
    color: var(--color-text-tertiary);
    line-height: 0.9;
  }

  p {
    margin: 20px 0 0;
    max-width: 500px;
  }

  .email-link {
    ${({ theme }) => theme.mixins.bigButton};
    margin-top: 50px;
    color: var(--color-accent);
    border-color: var(--color-accent);
  }

  .typewriter {
    display: inline-block;
    border-right: 2px solid var(--color-accent);
    animation: blink 1s infinite;
  }

  @keyframes blink {
    0%, 50% { border-color: var(--color-accent); }
    51%, 100% { border-color: transparent; }
  }
`;

const Hero = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const words = ['Robots.', 'Humanoids.', 'cool stuff.'];

  useEffect(() => {
    const timeout = setTimeout(() => setIsMounted(true), navDelay);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const typeSpeed = isDeleting ? 50 : 100;
    const currentWord = words[currentWordIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting && currentText === currentWord) {
        // Finished typing, wait then start deleting
        setTimeout(() => setIsDeleting(true), 2500);
      } else if (isDeleting && currentText === '') {
        // Finished deleting, move to next word
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
      } else {
        // Continue typing or deleting
        setCurrentText(prev =>
          isDeleting
            ? prev.slice(0, -1)
            : currentWord.slice(0, prev.length + 1)
        );
      }
    }, typeSpeed);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentWordIndex, isMounted, words]);

  const one = <p>Hi, my name is</p>;
  const two = <h1 className="big-heading">Daksh Adhar</h1>;
  const three = (
    <h2 className="big-heading">
      I like building <span className="typewriter">{currentText}</span>
    </h2>
  );

  const items = [one, two, three];

  return (
    <StyledHeroSection>
      <TransitionGroup component={null}>
        {isMounted &&
          items.map((item, i) => (
            <CSSTransition key={i} classNames="fadeup" timeout={loaderDelay}>
              <div style={{ transitionDelay: `${i + 1}00ms` }}>{item}</div>
            </CSSTransition>
          ))}
      </TransitionGroup>
    </StyledHeroSection>
  );
};

export default Hero;
