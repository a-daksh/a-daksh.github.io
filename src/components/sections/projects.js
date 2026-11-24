import React, { useEffect, useRef } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import styled from 'styled-components';
import { reveal } from '@utils/reveal';
import { revealConfig } from '@config';
import ProjectCard from '../projectCard';

const StyledProjectsSection = styled.section`
  max-width: 1000px;
  margin: 0 auto;
  padding: 100px 20px;

  @media (max-width: 768px) {
    padding: 80px 15px;
  }
  @media (max-width: 480px) {
    padding: 60px 15px;
  }
`;

// The /archive page. Content: content/projects/<Folder>/index.md (newest folder first).
const Projects = () => {
  const data = useStaticQuery(graphql`
    query {
      projects: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/projects/" } }
        sort: { fileAbsolutePath: DESC }
      ) {
        nodes {
          id
          ...ProjectCard
        }
      }
    }
  `);
  const projects = data.projects.nodes;

  const revealTitle = useRef(null);
  const revealProjects = useRef([]);

  useEffect(() => {
    reveal(revealTitle.current, revealConfig());
    revealProjects.current.forEach((el, i) => reveal(el, revealConfig(i * 100)));
  }, []);

  return (
    <StyledProjectsSection id="projects">
      <h2 className="numbered-heading" ref={revealTitle}>
        Archive
      </h2>

      <div>
        {projects.map((project, i) => (
          <ProjectCard
            key={project.id}
            project={project}
            overline="Project"
            ref={el => (revealProjects.current[i] = el)}
          />
        ))}
      </div>
    </StyledProjectsSection>
  );
};

export default Projects;
