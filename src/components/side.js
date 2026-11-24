import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// Fixed vertical rail on the left (social icons) or right (email) edge of the home page.
const StyledSideElement = styled.div`
  width: 40px;
  position: fixed;
  bottom: 0;
  left: ${({ $orientation }) => ($orientation === 'left' ? '40px' : 'auto')};
  right: ${({ $orientation }) => ($orientation === 'left' ? 'auto' : '40px')};
  z-index: 10;
  color: var(--color-text-secondary);

  @media (max-width: 1080px) {
    left: ${({ $orientation }) => ($orientation === 'left' ? '20px' : 'auto')};
    right: ${({ $orientation }) => ($orientation === 'left' ? 'auto' : '20px')};
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const Side = ({ children, orientation }) => (
  <StyledSideElement
    $orientation={orientation}
    className="intro-fade"
    style={{ '--intro-delay': '600ms' }}>
    {children}
  </StyledSideElement>
);

Side.propTypes = {
  children: PropTypes.node.isRequired,
  orientation: PropTypes.oneOf(['left', 'right']).isRequired,
};

export default Side;
