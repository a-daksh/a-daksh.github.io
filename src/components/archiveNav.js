import React, { useState, useEffect } from 'react';
import { navigate } from 'gatsby';
import styled from 'styled-components';
import { ThemeToggle } from '@components';
import { Icon } from '@components/icons';

const StyledHeader = styled.header`
  ${({ theme }) => theme.mixins.flexBetween};
  position: fixed;
  top: 0;
  z-index: 11;
  padding: 0px 50px;
  width: 100%;
  height: var(--nav-height);
  background-color: var(--color-bg-primary);
  filter: none !important;
  pointer-events: auto !important;
  user-select: auto !important;
  backdrop-filter: blur(10px);
  transition: var(--transition);
  opacity: 0.7;

  @media (max-width: 1080px) {
    padding: 0 40px;
  }
  @media (max-width: 768px) {
    padding: 0 25px;
  }
`;

const StyledNav = styled.nav`
  ${({ theme }) => theme.mixins.flexBetween};
  position: relative;
  width: 100%;
  color: var(--color-text-primary);
  font-family: var(--font-mono);
  z-index: 12;
`;

const StyledBackButton = styled.button`
  ${({ theme }) => theme.mixins.flexCenter};
  background: none;
  border: none;
  color: var(--color-accent);
  font-family: var(--font-mono);
  font-size: var(--fz-sm);
  cursor: pointer;
  padding: 10px;
  transition: var(--transition);
  
  &:hover {
    color: var(--color-text-primary);
  }
  
  svg {
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }
`;



const StyledThemeToggleContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ArchiveNav = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsMounted(true);
        }, 100);

        return () => {
            clearTimeout(timeout);
        };
    }, []);

    const handleBackClick = () => {
        navigate('/');
    };

    return (
        <StyledHeader>
            <StyledNav>
                <StyledBackButton onClick={handleBackClick}>
                    <Icon name="ArrowLeft" />
                    Back
                </StyledBackButton>

                <StyledThemeToggleContainer>
                    {isMounted && <ThemeToggle />}
                </StyledThemeToggleContainer>
            </StyledNav>
        </StyledHeader>
    );
};

export default ArchiveNav;