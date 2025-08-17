import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';

import Carousel from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';

const StyledSkillsSection = styled.section`
  max-width: 700px;
  min-height: 50vh;

  @media (max-width: 768px) {
    min-height: auto;
  }

  .inner {
    display: flex;

    @media (max-width: 600px) {
      display: block;
    }
  }
`;

const SliderWrapper = styled.div`
  .skill-icon-container {
    margin: 2vh 2vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100px;
    height: 100px;
  }
  
  .skill-icon-img {
    width: 80px !important;
    height: 80px !important;
    min-width: 80px !important;
    min-height: 80px !important;
    max-width: none !important;
    max-height: none !important;
    object-fit: contain;
    display: block;
    margin: 0 auto;
    filter: grayscale(50%);

    @media (max-width: 600px) {
      width: 60px !important;
      height: 60px !important;
      min-width: 60px !important;
      min-height: 60px !important;
    }
  }
  
  .BrainhubCarousel .skill-icon-img {
    width: 80px !important;
    height: 80px !important;
    min-width: 80px !important;
    min-height: 80px !important;
    
    @media (max-width: 600px) {
      width: 60px !important;
      height: 60px !important;
      min-width: 60px !important;
      min-height: 60px !important;
    }
  }
  
  .skill-icon-container .skill-icon-img {
    width: 80px !important;
    height: 80px !important;
    min-width: 80px !important;
    min-height: 80px !important;
    
    @media (max-width: 600px) {
      width: 60px !important;
      height: 60px !important;
      min-width: 60px !important;
      min-height: 60px !important;
    }
  }
  
  .BrainhubCarousel__arrows {
    border: 1px solid var(--color-accent);
    border-radius: 50%;
    background: rgba(0, 0, 0, 0);
    span {
      border-color: var(--color-accent);
    }
    &:hover {
      border: 1px solid var(--color-text-secondary);
      background: var(--color-accent);
      span {
        border-color: var(--color-text-secondary);
      }
      &:enabled {
        background: var(--color-accent);
      }
    }
  }
  
  .BrainhubCarousel__trackContainer {
    margin: 0 2.1em;
    padding: 0 1.3em;
    border-radius: 4px;
    background: transparent;
  }
`;

const skills = [
  { name: 'python', label: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
  { name: 'cpp', label: 'C++', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg' },
  { name: 'matlab', label: 'MATLAB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/matlab/matlab-original.svg' },
  { name: 'pytorch', label: 'PyTorch', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg' },
  { name: 'tensorflow', label: 'TensorFlow', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg' },
  { name: 'ros', label: 'ROS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ros/ros-original.svg' },
  { name: 'docker', label: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
  { name: 'dbeaver', label: 'DBeaver', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dbeaver/dbeaver-original.svg' },
  { name: 'gitlab', label: 'GitLab', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg' },
  { name: 'github', label: 'GitHub', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg' },
  { name: 'git', label: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
  { name: 'linux', label: 'Linux', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg' },
  { name: 'ubuntu', label: 'Ubuntu', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ubuntu/ubuntu-original.svg' },
  { name: 'raspberrypi', label: 'Raspberry Pi', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/raspberrypi/raspberrypi-original.svg' },
  { name: 'arduino', label: 'Arduino', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/arduino/arduino-original.svg' },
];

const Skills = () => {
  const [skillsDisplayed, setSkillsDisplayed] = useState(0.5);

  const revealContainer = useRef(null);
  useEffect(() => sr.reveal(revealContainer.current, srConfig()), []);

  const handleResize = () => {
    const width = window.innerWidth;
    if (width > 850) {
      setSkillsDisplayed(6);
    } else if (width > 640) {
      setSkillsDisplayed(5);
    } else if (width > 540) {
      setSkillsDisplayed(4);
    } else {
      setSkillsDisplayed(3);
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener(`resize`, handleResize);
    return () => window.removeEventListener(`resize`, handleResize);
  });

  return (
    <StyledSkillsSection id="skills" ref={revealContainer}>
      <h2 className="numbered-heading">Some of my skills...</h2>
      <div className="section skills-container" id="skills">
        <SliderWrapper>
          <Carousel
            slidesPerPage={skillsDisplayed}
            arrows={skillsDisplayed > 4}
            autoPlay={2700}
            infinite
          >
            {skills.map(skill => (
              <div className="skill-icon-container" key={skill.name}>
                <img
                  src={skill.icon}
                  alt={skill.label}
                  className="skill-icon-img"
                />
              </div>
            ))}
          </Carousel>
        </SliderWrapper>
      </div>
    </StyledSkillsSection>
  );
};

export default Skills;