import React, { useEffect, useRef } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { GatsbyImage } from "gatsby-plugin-image"
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';

const StyledAboutSection = styled.section`
  max-width: 900px;

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
    text-align: justify;
  }
`;

const StyledPic = styled.div`
  position: relative;
  max-width: 250px;

  @media (max-width: 768px) {
    margin: 50px auto 0;
    width: 70%;
  }

  .wrapper {
    display: block;
    position: relative;
    width: 100%;
    border-radius: var(--border-radius);
    background-color: transparent;

    &:hover,
    &:focus {
      outline: 0;

      .img {
        filter: none;
        mix-blend-mode: normal;
      }
    }

    .img {
      max-width: 500px;
      position: relative;
      border-radius: var(--border-radius);
      mix-blend-mode: multiply;
      filter: grayscale(80%) contrast(1);
      transition: var(--transition);
    }

    &:before {
      content: '';
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      border-radius: var(--border-radius);
      background-color: transparent;
      mix-blend-mode: screen;
      transition: var(--transition);
    }
  }
`;

const About = () => {
  const data = useStaticQuery(graphql`
    query {
      avatar: file(
        sourceInstanceName: { eq: "images" }
        relativePath: { eq: "DakshAdhar.jpg" }
      ) {
        childImageSharp {
          gatsbyImageData(
            layout: FULL_WIDTH
            tracedSVGOptions: {
              color: "#64ffda"
            }
          )
        }
      }
    }
  `);

  const revealContainer = useRef(null);

  useEffect(() => {
    sr.reveal(revealContainer.current, srConfig());
  }, []);

  return (
    <StyledAboutSection id="about" ref={revealContainer}>
      <h2 className="numbered-heading">About Me</h2>

      <div className="inner">
        <StyledText>
          <div>
          <p>
            Hello! I'm Daksh, a robotics engineer and graduate student at Carnegie Mellon University, currently based in Pittsburgh, PA. I previously earned my Bachelor's in Engineering Physics from the <a href="https://www.iitg.ac.in/" target="_blank" rel="noopener noreferrer">Indian Institute of Technology Guwahati</a>.
          </p>

          <p>
            I'm interested in building intelligent robotic systems that can safely and reliably interact with the physical world. I enjoy working at the intersection of learning, control, and real-time perception, especially in medical robotics and biomimetics.
          </p>

          <p>
            I'm currently an AI Resident at <a href="https://www.1x.tech/" target="_blank" rel="noopener noreferrer">1X</a>, working on their humanoid robots. I've previously collaborated with <a href="https://www.iitg.ac.in/s.m.hazarika/" target="_blank" rel="noopener noreferrer">Dr. S. M. Hazarika</a> at IIT Guwahati and <a href="https://sites.google.com/iitgn.ac.in/nvg/" target="_blank" rel="noopener noreferrer">Dr. Nithin V. George</a> at IIT Gandhinagar.
          </p>

          <p>
          In my spare time, I'm usually playing minecraft, watching cooking videos (then ordering Panda Express :P), or sleeping.
          </p>
          </div>
        </StyledText>

        <StyledPic>
          <div className="wrapper">
            <GatsbyImage image={data.avatar.childImageSharp.gatsbyImageData} alt="Avatar" className="img" />
          </div>
        </StyledPic>
      </div>
    </StyledAboutSection>
  );
};

export default About;
