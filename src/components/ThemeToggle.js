import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';

const StyledToggle = styled.button`
  background: transparent;
  border: 1px solid var(--color-accent);
  border-radius: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px;
  position: relative;
  width: 70px;
  height: 38px;
  transition: var(--transition);

  &:hover {
    background-color: var(--color-accent-tint);
  }

  &:focus {
    outline: none;
    background-color: var(--color-accent-tint);
  }
`;

const ToggleSlider = styled.div`
  background: transparent;
  border: 1px solid var(--color-accent);
  border-radius: 50%;
  height: 26px;
  width: 26px;
  position: absolute;
  left: 6px;
  top: 50%;
  transform: translateY(-50%) translateX(${props => props.isDark ? '0px' : '32px'});
  transition: var(--transition);
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  z-index: 1;
  
  svg {
    width: 16px;
    height: 16px;
    fill: none;
    stroke: var(--color-accent);
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    opacity: ${props => props.isActive ? '1' : '0.4'};
    transition: var(--transition);
  }
  
  /* Adjust sun icon to center its circle, not the entire SVG */
  &:last-child svg {
    transform: translateX(-1px);
  }
`;

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <StyledToggle onClick={toggleTheme} aria-label="Toggle theme">
      <IconContainer isActive={isDark}>
        {/* Moon Icon */}
        <svg viewBox="0 0 24 24">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </IconContainer>
      <IconContainer isActive={!isDark}>
        {/* Sun Icon */}
        <svg viewBox="0 0 24 24">
          <circle cx="15.5" cy="12" r="7" />
          <line x1="15.5" y1="1" x2="15.5" y2="3" />
          <line x1="15.5" y1="21" x2="15.5" y2="23" />
          <line x1="7.72" y1="4.22" x2="9.14" y2="5.64" />
          <line x1="21.86" y1="18.36" x2="23.28" y2="19.78" />
          <line x1="4.5" y1="12" x2="6.5" y2="12" />
          <line x1="24.5" y1="12" x2="26.5" y2="12" />
          <line x1="7.72" y1="19.78" x2="9.14" y2="18.36" />
          <line x1="21.86" y1="5.64" x2="23.28" y2="4.22" />
        </svg>
      </IconContainer>
      <ToggleSlider isDark={isDark} />
    </StyledToggle>
  );
};

export default ThemeToggle;