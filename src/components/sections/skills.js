import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { withPrefix } from 'gatsby';
import styled from 'styled-components';
import { revealConfig } from '@config';
import { reveal } from '@utils/reveal';
import { usePrefersReducedMotion } from '@hooks';

/*
 * Skills: a horizontally scrollable row of logos with previous/next buttons. It also steps along
 * on its own every few seconds (like the original carousel), pausing while the visitor hovers,
 * focuses or uses it, while it is off screen, and entirely for visitors who prefer reduced motion.
 * Swiping / trackpad scrolling works too.
 * Logos are self-hosted in static/icons/skills/ (from devicon 2.16.0, MIT), plus JAX's own logo.
 * `invertOnDark`: logos drawn in black that would vanish on the dark theme.
 */
const SKILLS = [
  { label: 'Python', file: 'python.svg' },
  { label: 'C++', file: 'cplusplus.svg' },
  { label: 'MATLAB', file: 'matlab.svg' },
  { label: 'PyTorch', file: 'pytorch.svg' },
  { label: 'JAX', file: 'jax.svg' },
  { label: 'TensorFlow', file: 'tensorflow.svg' },
  { label: 'ROS', file: 'ros.svg', invertOnDark: true },
  { label: 'Docker', file: 'docker.svg' },
  { label: 'Kubernetes', file: 'kubernetes.svg' },
  { label: 'GitLab', file: 'gitlab.svg' },
  { label: 'GitHub', file: 'github.svg', invertOnDark: true },
  { label: 'Git', file: 'git.svg' },
  { label: 'Linux', file: 'linux.webp' },
  { label: 'Ubuntu', file: 'ubuntu.svg' },
  { label: 'Raspberry Pi', file: 'raspberrypi.svg' },
  { label: 'Arduino', file: 'arduino.svg' },
];

const AUTOPLAY_MS = 2700; // same pace as the original carousel
const RESUME_AFTER_MS = 8000; // after the visitor scrolls or clicks, wait this long before auto-stepping again
const PAUSE_EVENTS = ['wheel', 'touchstart', 'keydown'];

const StyledSkillsSection = styled.section`
  .skills-row {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 12px;
  }

  .track {
    display: flex;
    margin: 0;
    padding: 10px 0;
    list-style: none;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    overscroll-behavior-x: contain;
    scrollbar-width: none; /* the buttons and swiping do the scrolling */
    /* fade the row out at both edges */
    mask-image: linear-gradient(to right, transparent, #000 5%, #000 95%, transparent);

    &::-webkit-scrollbar {
      display: none;
    }

    @media (prefers-reduced-motion: reduce) {
      scroll-behavior: auto;
    }
  }

  .skill {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    width: 120px;
    flex-shrink: 0;
    scroll-snap-align: start;

    @media (max-width: 480px) {
      width: 96px;
    }

    img {
      width: 60px;
      height: 60px;
      object-fit: contain;
      filter: grayscale(50%);
      transition: var(--transition);
    }

    span {
      color: var(--color-text-secondary);
      font-family: var(--font-mono);
      font-size: var(--fz-xxs);
      white-space: nowrap;
    }

    &:hover img {
      filter: none;
      transform: translateY(-3px);
    }
  }

  :root:not([data-theme='light']) & .skill img.invert-on-dark {
    filter: grayscale(50%) invert(1);
  }

  .arrow {
    ${({ theme }) => theme.mixins.flexCenter};
    width: 40px;
    height: 40px;
    padding: 0;
    border: 1px solid var(--color-accent);
    border-radius: 50%;
    background: transparent;
    color: var(--color-accent);
    cursor: pointer;
    transition: var(--transition);

    &:hover,
    &:focus-visible {
      background: var(--color-accent);
      color: var(--color-bg-primary);
    }

    svg {
      width: 16px;
      height: 16px;
    }

    @media (max-width: 480px) {
      width: 32px;
      height: 32px;
    }
  }
`;

const Chevron = ({ flip }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    style={flip ? { transform: 'scaleX(-1)' } : undefined}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

Chevron.propTypes = {
  flip: PropTypes.bool,
};

// Scroll the row by one logo; past either end, wrap around to the other end.
const step = (track, direction) => {
  const item = track.firstElementChild;
  const amount = item ? item.getBoundingClientRect().width : 120;
  const maxLeft = track.scrollWidth - track.clientWidth;
  let target = track.scrollLeft + direction * amount;
  if (direction > 0 && track.scrollLeft >= maxLeft - 2) {
    target = 0;
  } else if (direction < 0 && track.scrollLeft <= 2) {
    target = maxLeft;
  }
  track.scrollTo({ left: target });
};

const Skills = () => {
  const revealContainer = useRef(null);
  const trackRef = useRef(null);
  const pausedUntil = useRef(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => reveal(revealContainer.current, revealConfig()), []);

  const onArrow = direction => {
    pausedUntil.current = Date.now() + RESUME_AFTER_MS;
    if (trackRef.current) {
      step(trackRef.current, direction);
    }
  };

  // Auto-step only while the row is on screen, the tab is visible and nobody is interacting with it.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || prefersReducedMotion) {
      return undefined;
    }
    const row = track.parentElement;
    let onScreen = false;
    let hovered = false;

    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
    });
    observer.observe(track);

    const onEnter = () => {
      hovered = true;
    };
    const onLeave = () => {
      hovered = false;
    };
    const pause = () => {
      pausedUntil.current = Date.now() + RESUME_AFTER_MS;
    };
    row.addEventListener('pointerenter', onEnter);
    row.addEventListener('pointerleave', onLeave);
    PAUSE_EVENTS.forEach(e => track.addEventListener(e, pause, { passive: true }));

    const timer = setInterval(() => {
      const focused = row.contains(document.activeElement);
      if (
        onScreen &&
        !hovered &&
        !focused &&
        !document.hidden &&
        Date.now() > pausedUntil.current
      ) {
        step(track, 1);
      }
    }, AUTOPLAY_MS);

    return () => {
      clearInterval(timer);
      observer.disconnect();
      row.removeEventListener('pointerenter', onEnter);
      row.removeEventListener('pointerleave', onLeave);
      PAUSE_EVENTS.forEach(e => track.removeEventListener(e, pause));
    };
  }, [prefersReducedMotion]);

  return (
    <StyledSkillsSection id="skills" ref={revealContainer}>
      <h2 className="numbered-heading">Some of my skills...</h2>

      <div className="skills-row">
        <button
          type="button"
          className="arrow"
          aria-label="Scroll skills left"
          onClick={() => onArrow(-1)}>
          <Chevron flip />
        </button>

        <ul className="track" ref={trackRef} aria-label="Skills">
          {SKILLS.map(({ label, file, invertOnDark }) => (
            <li key={label} className="skill">
              <img
                src={withPrefix(`/icons/skills/${file}`)}
                alt=""
                width="60"
                height="60"
                loading="lazy"
                className={invertOnDark ? 'invert-on-dark' : undefined}
              />
              <span>{label}</span>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="arrow"
          aria-label="Scroll skills right"
          onClick={() => onArrow(1)}>
          <Chevron />
        </button>
      </div>
    </StyledSkillsSection>
  );
};

export default Skills;
