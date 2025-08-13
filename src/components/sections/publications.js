import React, { useEffect, useRef } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { Icon } from '@components/icons';

const StyledPublicationsSection = styled.section`
  max-width: 1000px;
`;

const StyledPublication = styled.div`
  position: relative;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(12, 1fr);
  align-items: center;

  &:not(:last-of-type) {
    margin-bottom: 100px;

    @media (max-width: 768px) {
      margin-bottom: 70px;
    }

    @media (max-width: 480px) {
      margin-bottom: 30px;
    }
  }

  .publication-content {
    position: relative;
    grid-column: 1 / -1;
    grid-row: 1 / -1;

    @media (max-width: 768px) {
      grid-column: 1 / -1;
      padding: 40px 40px 30px;
      z-index: 5;
    }

    @media (max-width: 480px) {
      padding: 30px 25px 20px;
    }
  }

  .publication-overline {
    margin: 10px 0;
    color: var(--color-accent);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    font-weight: 400;
  }

  .publication-title {
    color: var(--color-text-primary);
    font-size: clamp(20px, 4vw, 24px);
    margin: 0 0 10px;

    @media (max-width: 768px) {
      color: var(--color-text-primary);
    }
  }

  .publication-authors {
    color: var(--color-text-secondary);
    font-size: var(--fz-md);
    margin: 0 0 10px;
    font-style: italic;
  }

  .publication-venue {
    color: var(--color-text-secondary);
    font-size: var(--fz-sm);
    margin: 0 0 15px;
    font-weight: 600;
  }

  .publication-description {
    ${({ theme }) => theme.mixins.boxShadow};
    position: relative;
    z-index: 2;
    padding: 25px;
    border-radius: var(--border-radius);
    background-color: rgba(var(--color-bg-primary-rgb), 0.85);
    color: var(--color-bg-secondary);
    font-size: var(--fz-lg);
    text-align: justify;

    @media (max-width: 768px) {
      padding: 20px 0;
      background-color: transparent;
      box-shadow: none;
      color: var(--color-text-secondary);

      &:hover {
        box-shadow: none;
      }
    }

    a {
      ${({ theme }) => theme.mixins.inlineLink};
      color: var(--color-bg-secondary);
    }
  }

  .publication-description-wrapper {
    position: relative;
  }

  .publication-links {
    position: absolute;
    top: -10px;
    right: -10px;
    z-index: 3;
    color: var(--color-text-secondary);

    a {
      ${({ theme }) => theme.mixins.flexCenter};

      &:hover {
        color: var(--color-accent);
        transform: translateY(-2px);
        transition: var(--transition);
      }

      &.external {
        svg {
          width: 22px;
          height: 22px;
        }
      }

      svg {
        width: 20px;
        height: 20px;
      }
    }
  }
`;

const Publications = () => {
  const data = useStaticQuery(graphql`
    query {
      publications: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/publications/" } }
        sort: { frontmatter: { date: ASC } }
      ) {
        edges {
          node {
            frontmatter {
              title
              authors
              venue
              publishDate
              external
              linkText
            }
            html
          }
        }
      }
    }
  `);

  const publicationList = data.publications.edges.filter(({ node }) => node);

  const revealTitle = useRef(null);
  const revealPublications = useRef([]);
  
  useEffect(() => {
    sr.reveal(revealTitle.current, srConfig());
    revealPublications.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 100)));
  }, []);

  return (
    <StyledPublicationsSection id="publications">
      <h2 className="numbered-heading" ref={revealTitle}>
        Publications
      </h2>

      <div>
        {publicationList &&
          publicationList.map(({ node }, i) => {
            const { frontmatter, html } = node;
            const { title, authors, venue, publishDate, type, external, linkText } = frontmatter;

            return (
              <StyledPublication key={i} ref={el => (revealPublications.current[i] = el)}>
                <div className="publication-content">
                  <p className="publication-overline">{type}</p>
                  <h3 className="publication-title">{title}</h3>
                  <p className="publication-authors">{authors}</p>
                  <p className="publication-venue">{venue} • {publishDate}</p>
                  <div className="publication-description-wrapper">
                    <div className="publication-description" dangerouslySetInnerHTML={{ __html: html }} />
                    <div className="publication-links">
                      {external && (
                        <a href={external} target="_blank" rel="noopener noreferrer" aria-label="Publication Link" className="external">
                          <Icon name="External" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </StyledPublication>
            );
          })}
      </div>
    </StyledPublicationsSection>
  );
};

export default Publications;