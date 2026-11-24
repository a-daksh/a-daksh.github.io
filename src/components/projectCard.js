import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';
import styled from 'styled-components';
import { Icon } from '@components/icons';
import LazyVideo from './lazyVideo';

/*
 * One project row (text card overlapping a cover image/video), used by both the home page's
 * Featured section and the /archive page. Rows alternate sides on desktop.
 *
 * Content lives in content/{featured,projects}/<Folder>/index.md:
 *   cover: './cover.jpg'   required still image (also the poster for videos)
 *   video: './video.mp4'   optional looping clip (make one with tools/media/make-cover.sh)
 *   github / external      optional links
 */

export const query = graphql`
  fragment ProjectCard on MarkdownRemark {
    html
    frontmatter {
      title
      tech
      github
      external
      cover {
        childImageSharp {
          gatsbyImageData(width: 700, layout: CONSTRAINED, placeholder: DOMINANT_COLOR)
        }
      }
      video {
        publicURL
      }
    }
  }
`;

const StyledProject = styled.div`
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

  &:nth-of-type(odd) {
    .project-content {
      grid-column: 7 / -1;
      text-align: right;

      @media (max-width: 1080px) {
        grid-column: 5 / -1;
      }
      @media (max-width: 768px) {
        grid-column: 1 / -1;
        padding: 40px 40px 30px;
        text-align: left;
      }
      @media (max-width: 480px) {
        padding: 25px 25px 20px;
      }
    }
    .project-tech-list {
      justify-content: flex-end;

      li {
        margin: 0 0 5px 20px;
      }

      @media (max-width: 768px) {
        justify-content: flex-start;

        li {
          margin: 0 10px 5px 0;
        }
      }
    }
    .project-links {
      justify-content: flex-end;
      margin-left: 0;
      margin-right: -10px;

      @media (max-width: 768px) {
        justify-content: flex-start;
        margin-left: -10px;
        margin-right: 0;
      }
    }
    .project-image {
      grid-column: 1 / 8;

      @media (max-width: 768px) {
        grid-column: 1 / -1;
      }
    }
  }

  .project-content {
    position: relative;
    grid-column: 1 / 7;
    grid-row: 1 / -1;
    z-index: 4;

    @media (max-width: 1080px) {
      grid-column: 1 / 9;
    }
    @media (max-width: 768px) {
      grid-column: 1 / -1;
      padding: 40px 40px 30px;
      z-index: 5;
    }
    @media (max-width: 480px) {
      padding: 30px 25px 20px;
    }
  }

  .project-overline {
    margin: 10px 0;
    color: var(--color-accent);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    font-weight: 400;
  }

  .project-title {
    color: var(--color-text-primary);
    font-size: clamp(24px, 5vw, 28px);

    @media (min-width: 768px) {
      margin: 0 0 20px;
    }
  }

  .project-description {
    ${({ theme }) => theme.mixins.boxShadow};
    position: relative;
    z-index: 2;
    padding: 25px;
    border-radius: var(--border-radius);
    background-color: rgba(var(--color-bg-primary-rgb), 0.85);
    color: var(--color-bg-secondary);
    font-size: var(--fz-lg);
    text-align: justify;
    hyphens: auto;

    @media (max-width: 768px) {
      padding: 20px 0;
      background-color: transparent;
      box-shadow: none;
      color: var(--color-text-secondary);
      text-align: left;

      &:hover {
        box-shadow: none;
      }
    }

    a {
      ${({ theme }) => theme.mixins.inlineLink};
      color: var(--color-bg-secondary);
    }
  }

  .project-tech-list {
    display: flex;
    flex-wrap: wrap;
    position: relative;
    z-index: 2;
    margin: 25px 0 10px;
    padding: 0;
    list-style: none;

    li {
      margin: 0 20px 5px 0;
      color: var(--color-text-secondary);
      font-family: var(--font-mono);
      font-size: var(--fz-xs);
      white-space: nowrap;
    }

    @media (max-width: 768px) {
      margin: 10px 0;

      li {
        margin: 0 10px 5px 0;
        color: var(--color-text-primary);
      }
    }
  }

  .project-links {
    display: flex;
    align-items: center;
    position: relative;
    margin-top: 10px;
    margin-left: -10px;
    color: var(--color-text-secondary);

    a {
      ${({ theme }) => theme.mixins.flexCenter};
      padding: 10px;

      &.external svg {
        width: 22px;
        height: 22px;
        margin-top: -4px;
      }

      svg {
        width: 20px;
        height: 20px;
      }
    }
  }

  .project-image {
    ${({ theme }) => theme.mixins.boxShadow};
    grid-column: 6 / -1;
    grid-row: 1 / -1;
    position: relative;
    z-index: 1;

    @media (max-width: 768px) {
      grid-column: 1 / -1;
      height: 100%;
      opacity: 0.4;
    }
  }

  .project-media {
    position: relative;
    display: block;
    width: 100%;
    max-width: 700px;
    aspect-ratio: 16 / 9;
    background-color: var(--color-accent);
    border-radius: var(--border-radius);
    overflow: hidden;

    /* tint over the media; lifted on hover */
    &:before {
      content: '';
      position: absolute;
      inset: 0;
      z-index: 3;
      background-color: var(--color-bg-primary);
      opacity: 0.3;
      transition: var(--transition);
    }

    .img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: var(--transition);
    }
  }

  /* Hover zoom on every cover, linked or not */
  .project-media:hover,
  a.project-media:focus-visible {
    &:before {
      opacity: 0;
    }
    .img {
      transform: scale(1.05);
    }
  }
`;

const ProjectCard = forwardRef(({ project, overline }, ref) => {
  const { frontmatter, html } = project;
  const { title, tech, github, external, cover, video } = frontmatter;
  const link = external || github;
  const image = cover && cover.childImageSharp ? cover.childImageSharp.gatsbyImageData : null;

  const media = (
    <>
      {image && <GatsbyImage image={image} alt={title} className="img" />}
      {video && <LazyVideo src={video.publicURL} className="img" />}
    </>
  );

  return (
    <StyledProject ref={ref}>
      <div className="project-content">
        <p className="project-overline">{overline}</p>
        <h3 className="project-title">{title}</h3>
        <div className="project-description" dangerouslySetInnerHTML={{ __html: html }} />

        {tech && tech.length > 0 && (
          <ul className="project-tech-list">
            {tech.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}

        <div className="project-links">
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${title} on GitHub`}>
              <Icon name="GitHub" />
            </a>
          )}
          {external && (
            <a
              href={external}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${title}: more details`}
              className="external">
              <Icon name="External" />
            </a>
          )}
        </div>
      </div>

      <div className="project-image">
        {link ? (
          // Duplicate of the icon links above: mouse-only, hidden from keyboard and screen readers.
          <a
            className="project-media"
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={-1}
            aria-hidden="true">
            {media}
          </a>
        ) : (
          <div className="project-media">{media}</div>
        )}
      </div>
    </StyledProject>
  );
});

ProjectCard.displayName = 'ProjectCard';

ProjectCard.propTypes = {
  project: PropTypes.shape({
    html: PropTypes.string,
    frontmatter: PropTypes.object.isRequired,
  }).isRequired,
  overline: PropTypes.string.isRequired,
};

export default ProjectCard;
