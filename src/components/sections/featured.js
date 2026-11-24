import React, { useEffect, useRef } from 'react';
import { useStaticQuery, graphql, Link } from 'gatsby';
import styled from 'styled-components';
import { reveal } from '@utils/reveal';
import { revealConfig } from '@config';
import ProjectCard from '../projectCard';

const StyledArchiveLink = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 80px;

  @media (max-width: 768px) {
    margin-top: 60px;
  }

  a {
    ${({ theme }) => theme.mixins.bigButton};
  }
`;

// Home page "Featured Projects". Content: content/featured/<Folder>/index.md (newest folder first).
const Featured = () => {
  const data = useStaticQuery(graphql`
    query {
      featured: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/featured/" } }
        sort: { fileAbsolutePath: DESC }
      ) {
        nodes {
          id
          ...ProjectCard
        }
      }
    }
  `);
  const projects = data.featured.nodes;

  const revealTitle = useRef(null);
  const revealProjects = useRef([]);
  const revealArchiveLink = useRef(null);

  useEffect(() => {
    reveal(revealTitle.current, revealConfig());
    revealProjects.current.forEach((el, i) => reveal(el, revealConfig(i * 100)));
    reveal(revealArchiveLink.current, revealConfig());
  }, []);

  return (
    <section id="featured">
      <h2 className="numbered-heading" ref={revealTitle}>
        Featured Projects
      </h2>

      <div>
        {projects.map((project, i) => (
          <ProjectCard
            key={project.id}
            project={project}
            overline="Featured Project"
            ref={el => (revealProjects.current[i] = el)}
          />
        ))}
      </div>

      <StyledArchiveLink ref={revealArchiveLink}>
        <Link to="/archive/">Other Noteworthy Projects</Link>
      </StyledArchiveLink>
    </section>
  );
};

export default Featured;
