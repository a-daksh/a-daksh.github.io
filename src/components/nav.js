import React from 'react';
import { withPrefix } from 'gatsby';
import styled from 'styled-components';
import { navLinks } from '@config';
import { NAV_COLLAPSE_BP } from '@utils';
import { IconLogo } from '@components/icons';
import Header from './header';
import Menu from './menu';
import ThemeToggle from './themeToggle';

const StyledNav = styled.nav`
  ${({ theme }) => theme.mixins.flexBetween};
  position: relative;
  width: 100%;
  color: var(--color-text-primary);
  font-family: var(--font-mono);
  counter-reset: item 0;
  z-index: 12;
`;

const StyledLogo = styled.a`
  display: block;
  line-height: 0;
  color: var(--color-text-primary);
  transition: var(--transition);

  &:hover {
    transform: translateY(-2px);
  }
`;

const StyledLinks = styled.div`
  display: flex;
  align-items: center;
  margin: 0 auto;

  @media (max-width: ${NAV_COLLAPSE_BP}px) {
    display: none;
  }

  ol {
    ${({ theme }) => theme.mixins.flexBetween};
    padding: 0;
    margin: 0;
    list-style: none;

    li {
      margin: 0 5px;
      position: relative;
      counter-increment: item 1;
      font-size: var(--fz-xs);

      a {
        padding: 10px;
        color: var(--color-text-secondary);

        &:hover,
        &:focus-visible {
          color: var(--color-text-primary);
        }

        &:before {
          content: '0' counter(item) '.';
          margin-right: 5px;
          color: var(--color-accent);
          font-size: var(--fz-xxs);
          text-align: right;
        }
      }
    }
  }

  .resume-button {
    ${({ theme }) => theme.mixins.smallButton};
    margin-left: 15px;
    font-size: var(--fz-xs);
  }
`;

const StyledActions = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const Nav = () => (
  <Header>
    <StyledNav aria-label="Main">
      <StyledLogo href="#top" aria-label="DA, Daksh Adhar: back to top" className="intro-fade">
        <IconLogo />
      </StyledLogo>

      <StyledLinks>
        <ol>
          {navLinks.map(({ url, name }, i) => (
            <li key={name} className="intro-down" style={{ '--intro-delay': `${i * 70}ms` }}>
              <a href={url}>{name}</a>
            </li>
          ))}
        </ol>
        <div className="intro-down" style={{ '--intro-delay': `${navLinks.length * 70}ms` }}>
          <a
            className="resume-button"
            href={withPrefix('/Daksh_Adhar.pdf')}
            target="_blank"
            rel="noopener noreferrer">
            Resume
          </a>
        </div>
      </StyledLinks>

      <StyledActions className="intro-fade">
        <ThemeToggle />
        <Menu />
      </StyledActions>
    </StyledNav>
  </Header>
);

export default Nav;
