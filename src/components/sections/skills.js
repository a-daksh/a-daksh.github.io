import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { withPrefix } from 'gatsby';
import styled from 'styled-components';
import { revealConfig } from '@config';
import { reveal } from '@utils/reveal';
import { usePrefersReducedMotion } from '@hooks';

/*
 * Skills: a horizontally scrollable row of logos with previous/next buttons. It also steps along
 * on its own every few seconds (like the original carousel), also after the buttons are used. It
 * holds while a keyboard user is focused in it, briefly after a manual swipe, while off screen,
 * and entirely for visitors who prefer reduced motion.
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
const MANUAL_PAUSE_MS = 5000; // after the visitor scrolls the row themselves, give them time to look
const MANUAL_EVENTS = ['wheel', 'touchstart'];

// Keyboard focus inside the row (not a mouse click, which also leaves the button focused).
const hasKeyboardFocus = el => {
  try {
    return !!el.querySelector(':focus-visible');
  } catch (e) {
    return false; // browsers without :focus-visible
  }
};

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
  const nextStepAt = useRef(0); // time of the next automatic step
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => reveal(revealContainer.current, revealConfig()), []);

  // Buttons and auto-scroll work together: a click moves one logo, and auto-scroll carries on
  // from there one interval later.
  const onArrow = direction => {
    nextStepAt.current = Date.now() + AUTOPLAY_MS;
    if (trackRef.current) {
      step(trackRef.current, direction);
    }
  };

  // Auto-step while the row is on screen and the tab is visible. It holds only while a keyboard
  // user is focused inside the row, and briefly after the visitor swipes/scrolls it themselves.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || prefersReducedMotion) {
      return undefined;
    }
    const row = track.parentElement;
    let onScreen = false;
    nextStepAt.current = Date.now() + AUTOPLAY_MS;

    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
    });
    observer.observe(track);

    const onManualScroll = () => {
      nextStepAt.current = Date.now() + MANUAL_PAUSE_MS;
    };
    MANUAL_EVENTS.forEach(e => track.addEventListener(e, onManualScroll, { passive: true }));

    const timer = setInterval(() => {
      const now = Date.now();
      if (now < nextStepAt.current) {
        return;
      }
      nextStepAt.current = now + AUTOPLAY_MS;
      if (onScreen && !document.hidden && !hasKeyboardFocus(row)) {
        step(track, 1);
      }
    }, 250);

    return () => {
      clearInterval(timer);
      observer.disconnect();
      MANUAL_EVENTS.forEach(e => track.removeEventListener(e, onManualScroll));
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
