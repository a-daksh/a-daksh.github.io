import React, { useEffect, useRef, useState } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import styled from 'styled-components';
import { revealConfig } from '@config';
import { KEY_CODES } from '@utils';
import { reveal } from '@utils/reveal';

const StyledJobsSection = styled.section`
  /* Shares the 1000px section column (same left edge as the other sections);
     the tabs + panel keep a readable width. */
  .inner {
    display: flex;
    max-width: 850px;

    @media (max-width: 600px) {
      display: block;
    }
  }
`;

const StyledTabs = styled.div`
  position: relative;
  z-index: 3;
  width: max-content;
  flex-shrink: 0;

  @media (max-width: 600px) {
    width: calc(100% + 100px);
    margin-left: -50px;
    margin-bottom: 30px;
    overflow-x: auto;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  @media (max-width: 480px) {
    width: calc(100% + 50px);
    margin-left: -25px;
  }

  [role='tablist'] {
    display: flex;
    flex-direction: column;

    @media (max-width: 600px) {
      flex-direction: row;
      padding: 0 50px;
      width: max-content;
    }
    @media (max-width: 480px) {
      padding: 0 25px;
    }
  }
`;

const StyledTabButton = styled.button`
  ${({ theme }) => theme.mixins.link};
  display: flex;
  align-items: center;
  width: 100%;
  height: var(--tab-height);
  padding: 0 20px 2px;
  border: 0;
  border-left: 2px solid var(--color-accent-tint);
  background-color: ${({ $active }) => ($active ? 'var(--color-accent-tint)' : 'transparent')};
  color: ${({ $active }) =>
    $active ? 'var(--color-text-primary)' : 'var(--color-text-secondary)'};
  font-family: var(--font-mono);
  font-size: var(--fz-xs);
  text-align: left;
  white-space: nowrap;

  @media (max-width: 768px) {
    padding: 0 15px 2px;
  }
  @media (max-width: 600px) {
    ${({ theme }) => theme.mixins.flexCenter};
    min-width: 120px;
    padding: 0 15px;
    border-left: 0;
    border-bottom: 2px solid var(--color-accent-tint);
    text-align: center;
  }

  &:hover {
    background-color: var(--color-accent-tint);
    color: var(--color-text-primary);
  }
`;

// Accent bar marking the active tab (vertical on desktop, horizontal on mobile).
const StyledHighlight = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  width: 2px;
  height: var(--tab-height);
  border-radius: var(--border-radius);
  background: var(--color-accent);
  transform: translateY(calc(${({ $index }) => $index} * var(--tab-height)));
  transition: transform 0.25s var(--easing) 0.1s;

  @media (max-width: 600px) {
    top: auto;
    bottom: 0;
    width: var(--highlight-width, 120px);
    height: 2px;
    transform: translateX(var(--highlight-offset, 0px));
  }
`;

// All panels share one grid cell, so the section keeps the height of the tallest job
// and the content below doesn't jump when switching tabs.
const StyledPanels = styled.div`
  display: grid;
  width: 100%;
  padding-top: 10px;
  padding-left: 30px;

  @media (max-width: 768px) {
    padding-left: 20px;
  }
  @media (max-width: 600px) {
    padding-left: 0;
  }
`;

const StyledPanel = styled.div`
  grid-area: 1 / 1;
  visibility: ${({ $active }) => ($active ? 'visible' : 'hidden')};

  ul {
    ${({ theme }) => theme.mixins.fancyList};
  }

  h3 {
    margin-bottom: 5px;
    font-size: var(--fz-xxl);
    font-weight: 500;

    .company {
      color: var(--color-accent);

      a {
        ${({ theme }) => theme.mixins.inlineLink};
      }
    }
  }

  .range {
    margin-bottom: 25px;
    color: var(--color-text-secondary);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
  }

  /* Company blurb before the bullet list */
  .job-description > p {
    margin-bottom: 20px;
    font-size: var(--fz-md);
  }
`;

// "Where I've Worked". Content: content/jobs/<Company>/index.md (newest `date` first).
const Jobs = () => {
  const data = useStaticQuery(graphql`
    query {
      jobs: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/jobs/" } }
        sort: { frontmatter: { date: DESC } }
      ) {
        nodes {
          id
          html
          frontmatter {
            title
            company
            location
            range
            url
          }
        }
      }
    }
  `);
  const jobs = data.jobs.nodes;

  const [activeIndex, setActiveIndex] = useState(0);
  const tabs = useRef([]);
  const highlightRef = useRef(null);
  const revealContainer = useRef(null);

  useEffect(() => reveal(revealContainer.current, revealConfig()), []);

  // On mobile the tabs scroll horizontally: size and place the highlight under the active tab.
  useEffect(() => {
    const tab = tabs.current[activeIndex];
    if (highlightRef.current && tab) {
      highlightRef.current.style.setProperty('--highlight-width', `${tab.offsetWidth}px`);
      highlightRef.current.style.setProperty('--highlight-offset', `${tab.offsetLeft}px`);
    }
  }, [activeIndex]);

  // Arrow keys move between tabs (WAI-ARIA tabs pattern, activation follows focus).
  const onKeyDown = e => {
    const prev = [KEY_CODES.ARROW_UP, KEY_CODES.ARROW_LEFT].includes(e.key);
    const next = [KEY_CODES.ARROW_DOWN, KEY_CODES.ARROW_RIGHT].includes(e.key);
    if (!prev && !next) {
      return;
    }
    e.preventDefault();
    const index = (activeIndex + (next ? 1 : -1) + jobs.length) % jobs.length;
    setActiveIndex(index);
    tabs.current[index].focus();
  };

  return (
    <StyledJobsSection id="jobs" ref={revealContainer}>
      <h2 className="numbered-heading">Where I&apos;ve Worked</h2>

      <div className="inner">
        <StyledTabs>
          <div role="tablist" aria-label="Jobs">
            {jobs.map(({ id, frontmatter: { company } }, i) => (
              <StyledTabButton
                key={id}
                ref={el => (tabs.current[i] = el)}
                id={`tab-${i}`}
                role="tab"
                aria-selected={activeIndex === i}
                aria-controls={`panel-${i}`}
                tabIndex={activeIndex === i ? 0 : -1}
                $active={activeIndex === i}
                onClick={() => setActiveIndex(i)}
                onKeyDown={onKeyDown}>
                {company}
              </StyledTabButton>
            ))}
          </div>
          <StyledHighlight ref={highlightRef} $index={activeIndex} aria-hidden="true" />
        </StyledTabs>

        <StyledPanels>
          {jobs.map(({ id, html, frontmatter: { title, url, company, range } }, i) => (
            <StyledPanel
              key={id}
              id={`panel-${i}`}
              role="tabpanel"
              aria-labelledby={`tab-${i}`}
              aria-hidden={activeIndex !== i}
              tabIndex={activeIndex === i ? 0 : -1}
              className={activeIndex === i ? 'intro-fade' : undefined}
              $active={activeIndex === i}>
              <h3>
                <span>{title}</span>
                <span className="company">
                  &nbsp;@&nbsp;
                  {url ? (
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      {company}
                    </a>
                  ) : (
                    company
                  )}
                </span>
              </h3>

              <p className="range">{range}</p>

              <div className="job-description" dangerouslySetInnerHTML={{ __html: html }} />
            </StyledPanel>
          ))}
        </StyledPanels>
      </div>
    </StyledJobsSection>
  );
};

export default Jobs;
