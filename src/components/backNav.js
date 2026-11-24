import React from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';
import { Icon } from '@components/icons';
import Header from './header';
import ThemeToggle from './themeToggle';

const StyledNav = styled.nav`
  ${({ theme }) => theme.mixins.flexBetween};
  position: relative;
  width: 100%;
  color: var(--color-text-primary);
  font-family: var(--font-mono);
  z-index: 12;
`;

const StyledBackLink = styled(Link)`
  ${({ theme }) => theme.mixins.flexCenter};
  padding: 10px;
  margin-left: -10px;
  color: var(--color-accent);
  font-size: var(--fz-sm);

  &:hover,
  &:focus-visible {
    color: var(--color-text-primary);
  }

  svg {
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }
`;

/** Compact header for sub-pages (archive, 404): back to home + theme toggle. */
const BackNav = () => (
  <Header>
    <StyledNav aria-label="Main">
      <StyledBackLink to="/">
        <Icon name="ArrowLeft" />
        Back
      </StyledBackLink>
      <ThemeToggle />
    </StyledNav>
  </Header>
);

export default BackNav;
