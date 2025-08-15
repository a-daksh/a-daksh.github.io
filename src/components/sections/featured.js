import React, { useEffect, useRef } from 'react';
import { useStaticQuery, graphql, navigate } from 'gatsby';
import { GatsbyImage } from "gatsby-plugin-image"
import styled from 'styled-components';
import sr from '@utils/sr';
import { srConfig } from '@config';
import { Icon } from '@components/icons';

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
      }
      @media (max-width: 480px) {
        padding: 25px 25px 20px;
      }
    }
    .project-tech-list {
      justify-content: flex-end;

      li {
        margin: 0 0 5px 20px;

        @media (max-width: 768px) {
          margin: 0 0 5px 10px;
        }
      }
    }
    .project-links {
      justify-content: flex-end;
      margin-left: 0;
      margin-right: -10px;
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

    @media (max-width: 768px) {
      color: var(--color-text-primary);
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

      &.external {
        svg {
          width: 22px;
          height: 22px;
          margin-top: -4px;
        }
      }

      svg {
        width: 20px;
        height: 20px;
      }
    }
  }

  .project-image {
    ${({ theme }) => theme.mixins.boxShadow}
    grid-column: 6 / -1;
    grid-row: 1 / -1;
    position: relative;
    z-index: 1;

    @media (max-width: 768px) {
      grid-column: 1 / -1;
      height: 100%;
      opacity: 0.4;
    }

    a {
      width: 100%;
      background-color: var(--color-accent);
      border-radius: var(--border-radius);
      vertical-align: middle;

      &:hover,
      &:focus {
        background: transparent;
        &:before,
        .img {
          opacity: 1
          background: transparent;
          filter: none;
          transition: var(--transition);
        }
      }

      &:before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 3;
        transition: var(--transition);
        background-color: var(--color-bg-primary);
        mix-blend-mode: screen;
      }
    }

    .img {
      max-width: 700px;
      border-radius: var(--border-radius);
      mix-blend-mode: multiply;
      filter: grayscale(80%) contrast(1) brightness(90%);
      transition: var(--transition);


      @media (max-width: 768px) {
        object-fit: cover;
        width: auto;
        height: 100%;
        filter: grayscale(80%) contrast(1) brightness(80%);
      }
    }
  }
`;

const StyledArchiveLink = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 80px;
  
  @media (max-width: 768px) {
    margin-top: 60px;
  }
`;

const StyledArchiveButton = styled.button`
  ${({ theme }) => theme.mixins.bigButton};
  background: transparent;
  border: 1px solid var(--color-accent);
  color: var(--color-accent);
  font-family: var(--font-mono);
  font-size: var(--fz-sm);
  padding: 1.25rem 1.75rem;
  cursor: pointer;
  transition: var(--transition);
  
  &:hover,
  &:focus 
  {
    background-color: var(--color-accent-tint);
    transform: translateY(-3px);
    box-shadow: 0 10px 30px -15px var(--color-shadow);
  }
  
  &:active {
    transform: translateY(-1px);
  }
`;

const Featured = () => {
  const data = useStaticQuery(graphql`
    query {
      featured: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/featured/" } }
        sort: { frontmatter: { date: DESC } }
      ) {
        edges {
          node {
            frontmatter {
              title
              cover {
                childImageSharp {
                  gatsbyImageData(
                    layout: FULL_WIDTH
                    tracedSVGOptions: {
                      color: "#64ffda"
                    }
                  )
                }
              }
              tech
              github
              external
            }
            html
          }
        }
      }
    }
  `);

  const featuredProjects = data.featured.edges.filter(({ node }) => node);

  const revealTitle = useRef(null);
  const revealProjects = useRef([]);
  const revealArchiveLink = useRef(null);

  useEffect(() => {
    sr.reveal(revealTitle.current, srConfig());
    revealProjects.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 100)));
    sr.reveal(revealArchiveLink.current, srConfig(featuredProjects.length * 100));
  }, []);

  const handleArchiveClick = () => {
    navigate('/archive');
  };

  return (
    <section id="featured">
      <h2 className="numbered-heading" ref={revealTitle}>
        Featured Work
      </h2>

      <div>
        {featuredProjects &&
          featuredProjects.map(({ node }, i) => {
            const { frontmatter, html } = node;
            const { external, title, tech, github, cover } = frontmatter;

            return (
              <StyledProject key={i} ref={el => (revealProjects.current[i] = el)}>
                <div className="project-content">
                  <p className="project-overline">Featured Project</p>
                  <h3 className="project-title">{title}</h3>
                  <div className="project-description" dangerouslySetInnerHTML={{ __html: html }} />

                  {tech.length && (
                    <ul className="project-tech-list">
                      {tech.map((tech, i) => (
                        <li key={i}>{tech}</li>
                      ))}
                    </ul>
                  )}

                  <div className="project-links">
                    {github && (
                      <a href={github} target="_blank" aria-label="GitHub Link">
                        <Icon name="GitHub" />
                      </a>
                    )}
                    {external && (
                      <a href={external} target="_blank" aria-label="External Link" className="external">
                        <Icon name="External" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="project-image">
                  <a href={external ? external : github ? github : '#'}>
                    <GatsbyImage image={cover.childImageSharp.gatsbyImageData} alt={title} className="img" />
                  </a>
                </div>
              </StyledProject>
            );
          })}
      </div>

      <StyledArchiveLink ref={revealArchiveLink}>
        <StyledArchiveButton onClick={handleArchiveClick}>
          Other Noteworthy Projects
        </StyledArchiveButton>
      </StyledArchiveLink>
    </section>
  );
};

export default Featured;
