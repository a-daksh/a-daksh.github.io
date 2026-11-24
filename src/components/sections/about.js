import React, { useEffect, useRef } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';
import styled from 'styled-components';
import { revealConfig } from '@config';
import { reveal } from '@utils/reveal';

const StyledAboutSection = styled.section`
  .inner {
    display: grid;
    grid-template-columns: 3fr 2fr;
    grid-gap: 50px;

    @media (max-width: 768px) {
      display: block;
    }
  }
`;
const StyledText = styled.div`
  ul.skills-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(140px, 200px));
    padding: 0;
    margin: 20px 0 0 0;
    overflow: hidden;
    list-style: none;

    li {
      position: relative;
      margin-bottom: 10px;
      padding-left: 20px;
      font-family: var(--font-mono);
      font-size: var(--fz-xs);

      &:before {
        content: '▹';
        position: absolute;
        left: 0;
        color: var(--color-accent);
        font-size: var(--fz-sm);
        line-height: 12px;
      }
    }
  }

  p {
    text-align: left;

    a {
      ${({ theme }) => theme.mixins.inlineLink};
    }
  }
`;

const StyledPic = styled.div`
  position: relative;
  max-width: 250px;

  @media (max-width: 768px) {
    margin: 50px auto 0;
    width: 70%;
  }

  /* Same treatment as the project covers: a light tint that lifts on hover. */
  .wrapper {
    display: block;
    position: relative;
    width: 100%;
    border-radius: var(--border-radius);
    overflow: hidden;

    .img {
      border-radius: var(--border-radius);
    }

    &:before {
      content: '';
      position: absolute;
      inset: 0;
      z-index: 1;
      border-radius: var(--border-radius);
      background-color: var(--color-bg-primary);
      opacity: 0.3;
      transition: var(--transition);
    }

    &:hover:before {
      opacity: 0;
    }
  }
`;

const About = () => {
  const data = useStaticQuery(graphql`
    query {
      avatar: file(sourceInstanceName: { eq: "images" }, relativePath: { eq: "DakshAdhar.jpg" }) {
        childImageSharp {
          gatsbyImageData(width: 250, layout: CONSTRAINED, placeholder: DOMINANT_COLOR)
        }
      }
    }
  `);

  const revealContainer = useRef(null);

  useEffect(() => {
    reveal(revealContainer.current, revealConfig());
  }, []);

  return (
    <StyledAboutSection id="about" ref={revealContainer}>
      <h2 className="numbered-heading">About Me</h2>

      <div className="inner">
        <StyledText>
          <div>
            <p>
              Hi! I'm Daksh, an AI Engineer on the World Model Team at{' '}
              <a href="https://foundation.bot/" target="_blank" rel="noopener noreferrer">
                Foundation Robotics
              </a>{' '}
              in San Francisco. I earned my M.S. in Robotic Systems Development from the Robotics
              Institute at{' '}
              <a href="https://www.ri.cmu.edu/" target="_blank" rel="noopener noreferrer">
                Carnegie Mellon University
              </a>{' '}
              in May 2026, and my B.Tech. in Engineering Physics from the{' '}
              <a href="https://www.iitg.ac.in/" target="_blank" rel="noopener noreferrer">
                Indian Institute of Technology Guwahati
              </a>
              .
            </p>

            <p>
              I'm interested in robot learning that scales: dexterous manipulation, RL post-training
              of generative policies, and learning from human data. I like working end to end, from
              teleoperation and data pipelines to training policies and deploying them on real
              robots.
            </p>

            <p>
              Previously, I was an AI Resident at{' '}
              <a href="https://www.1x.tech/" target="_blank" rel="noopener noreferrer">
                1X
              </a>
              , training RL policies for in-hand manipulation on the NEO hand. I was also a research
              assistant in{' '}
              <a href="https://msimchowitz.github.io/" target="_blank" rel="noopener noreferrer">
                Prof. Max Simchowitz's
              </a>{' '}
              lab at CMU, building a benchmark for dexterous manipulation. Before that, I worked
              with{' '}
              <a
                href="https://www.iitg.ac.in/s.m.hazarika/"
                target="_blank"
                rel="noopener noreferrer">
                Dr. S. M. Hazarika
              </a>{' '}
              at IIT Guwahati and{' '}
              <a
                href="https://sites.google.com/iitgn.ac.in/nvg/"
                target="_blank"
                rel="noopener noreferrer">
                Dr. Nithin V. George
              </a>{' '}
              at IIT Gandhinagar.
            </p>

            <p>
              In my spare time, I’m usually playing Minecraft, watching cooking videos (then
              ordering DoorDash :P), or sleeping.
            </p>
          </div>
        </StyledText>

        <StyledPic>
          <div className="wrapper">
            <GatsbyImage
              image={data.avatar.childImageSharp.gatsbyImageData}
              alt="Daksh Adhar"
              className="img"
            />
          </div>
        </StyledPic>
      </div>
    </StyledAboutSection>
  );
};

export default About;
