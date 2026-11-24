import React, { useEffect, useRef } from 'react';
import { withPrefix } from 'gatsby';
import styled from 'styled-components';
import { revealConfig } from '@config';
import { reveal } from '@utils/reveal';

/*
 * Skills: an endlessly scrolling strip of logos (pure CSS, pauses on hover/focus).
 * Visitors who prefer reduced motion get a static, wrapped grid instead.
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

const StyledSkillsSection = styled.section`
  .marquee {
    overflow: hidden;
    /* fade the strip out at both edges */
    mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent);
  }

  .track {
    display: flex;
    width: max-content;
    margin: 0;
    padding: 10px 0;
    list-style: none;
    animation: skills-scroll 45s linear infinite;
  }

  .marquee:hover .track,
  .marquee:focus-within .track {
    animation-play-state: paused;
  }

  @keyframes skills-scroll {
    to {
      transform: translateX(-50%); /* the list is rendered twice, so -50% loops seamlessly */
    }
  }

  .skill {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    width: 120px;
    flex-shrink: 0;

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

  @media (prefers-reduced-motion: reduce) {
    .marquee {
      mask-image: none;
    }
    .track {
      animation: none;
      flex-wrap: wrap;
      justify-content: center;
      width: auto;
      row-gap: 24px;
    }
    .skill[aria-hidden='true'] {
      display: none;
    }
  }
`;

const Skills = () => {
  const revealContainer = useRef(null);
  useEffect(() => reveal(revealContainer.current, revealConfig()), []);

  // Rendered twice back to back for a seamless loop; the copy is hidden from assistive tech.
  const items = [...SKILLS, ...SKILLS];

  return (
    <StyledSkillsSection id="skills" ref={revealContainer}>
      <h2 className="numbered-heading">Some of my skills...</h2>

      <div className="marquee">
        <ul className="track">
          {items.map(({ label, file, invertOnDark }, i) => {
            const isCopy = i >= SKILLS.length;
            return (
              <li key={`${label}-${i}`} className="skill" aria-hidden={isCopy || undefined}>
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
            );
          })}
        </ul>
      </div>
    </StyledSkillsSection>
  );
};

export default Skills;
