import React, { useEffect, useRef, useState } from 'react';
import { withPrefix } from 'gatsby';
import styled from 'styled-components';
import { navLinks } from '@config';
import { KEY_CODES, NAV_COLLAPSE_BP } from '@utils';
import { useOnClickOutside } from '@hooks';

const StyledMenu = styled.div`
  display: none;

  @media (max-width: ${NAV_COLLAPSE_BP}px) {
    display: block;
  }
`;

// Styled-components "transient" props ($-prefixed) are not forwarded to the DOM.
const StyledHamburgerButton = styled.button`
  ${({ theme }) => theme.mixins.flexCenter};
  position: relative;
  z-index: 10;
  margin-right: -15px;
  padding: 15px;
  border: 0;
  background-color: transparent;
  color: inherit;
  text-transform: none;
  transition-timing-function: linear;
  transition-duration: 0.15s;
  transition-property: opacity, filter;

  .ham-box {
    display: inline-block;
    position: relative;
    width: var(--hamburger-width);
    height: 24px;
  }

  .ham-box-inner {
    position: absolute;
    top: 50%;
    right: 0;
    width: var(--hamburger-width);
    height: 2px;
    border-radius: var(--border-radius);
    background-color: var(--color-accent);
    transition-duration: 0.22s;
    transition-property: transform;
    transition-delay: ${({ $open }) => ($open ? `0.12s` : `0s`)};
    transform: rotate(${({ $open }) => ($open ? `225deg` : `0deg`)});
    transition-timing-function: cubic-bezier(
      ${({ $open }) => ($open ? `0.215, 0.61, 0.355, 1` : `0.55, 0.055, 0.675, 0.19`)}
    );
    &:before,
    &:after {
      content: '';
      display: block;
      position: absolute;
      left: auto;
      right: 0;
      width: var(--hamburger-width);
      height: 2px;
      border-radius: 4px;
      background-color: var(--color-accent);
      transition-timing-function: ease;
      transition-duration: 0.15s;
      transition-property: transform;
    }
    &:before {
      width: ${({ $open }) => ($open ? `100%` : `120%`)};
      top: ${({ $open }) => ($open ? `0` : `-10px`)};
      opacity: ${({ $open }) => ($open ? 0 : 1)};
      transition: ${({ $open }) => ($open ? 'var(--ham-before-active)' : 'var(--ham-before)')};
    }
    &:after {
      width: ${({ $open }) => ($open ? `100%` : `80%`)};
      bottom: ${({ $open }) => ($open ? `0` : `-10px`)};
      transform: rotate(${({ $open }) => ($open ? `-90deg` : `0`)});
      transition: ${({ $open }) => ($open ? 'var(--ham-after-active)' : 'var(--ham-after)')};
    }
  }
`;

const StyledSidebar = styled.aside`
  ${({ theme }) => theme.mixins.flexCenter};
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  padding: 50px 10px;
  width: min(75vw, 400px);
  height: var(--full-height);
  outline: 0;
  background-color: var(--color-bg-primary);
  box-shadow: -10px 0px 30px -15px var(--color-shadow);
  z-index: 9;
  transform: translateX(${({ $open }) => ($open ? 0 : 100)}vw);
  visibility: ${({ $open }) => ($open ? 'visible' : 'hidden')};
  transition: var(--transition);

  nav {
    ${({ theme }) => theme.mixins.flexBetween};
    width: 100%;
    flex-direction: column;
    color: var(--color-text-primary);
    font-family: var(--font-mono);
    text-align: center;
  }

  ol {
    padding: 0;
    margin: 0;
    list-style: none;
    width: 100%;

    li {
      position: relative;
      margin: 0 auto 20px;
      font-size: clamp(var(--fz-sm), 4vw, var(--fz-lg));

      @media (max-width: 600px) {
        margin: 0 auto 10px;
      }
    }

    a {
      ${({ theme }) => theme.mixins.link};
      width: 100%;
      padding: 3px 20px 20px;
    }
  }

  .resume-link {
    ${({ theme }) => theme.mixins.bigButton};
    padding: 18px 50px;
    margin: 10% auto 0;
    width: max-content;
  }
`;

const Menu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const buttonRef = useRef(null);
  const navRef = useRef(null);
  const wrapperRef = useRef(null);

  const closeMenu = () => setMenuOpen(false);
  useOnClickOutside(wrapperRef, closeMenu);

  useEffect(() => {
    // Keep keyboard focus inside the open menu; Escape closes it.
    const onKeyDown = e => {
      if (e.key === KEY_CODES.ESCAPE) {
        closeMenu();
        return;
      }
      if (e.key !== KEY_CODES.TAB || !navRef.current) {
        return;
      }
      const focusables = [buttonRef.current, ...navRef.current.querySelectorAll('a')];
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    const onResize = () => {
      if (window.innerWidth > NAV_COLLAPSE_BP) {
        closeMenu();
      }
    };

    if (menuOpen) {
      document.addEventListener('keydown', onKeyDown);
    }
    window.addEventListener('resize', onResize);
    // Blur the page behind the open menu and stop it scrolling (styles: `body.blur` in GlobalStyle).
    document.body.classList.toggle('blur', menuOpen);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
      document.body.classList.remove('blur');
    };
  }, [menuOpen]);

  return (
    <StyledMenu>
      <div ref={wrapperRef}>
        <StyledHamburgerButton
          ref={buttonRef}
          onClick={() => setMenuOpen(!menuOpen)}
          $open={menuOpen}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu">
          <div className="ham-box">
            <div className="ham-box-inner" />
          </div>
        </StyledHamburgerButton>

        <StyledSidebar id="mobile-menu" $open={menuOpen} aria-hidden={!menuOpen}>
          <nav ref={navRef} aria-label="Mobile">
            <ol>
              {navLinks.map(({ url, name }) => (
                <li key={name}>
                  <a href={url} onClick={closeMenu} tabIndex={menuOpen ? 0 : -1}>
                    {name}
                  </a>
                </li>
              ))}
            </ol>

            <a
              href={withPrefix('/Daksh_Adhar.pdf')}
              className="resume-link"
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={menuOpen ? 0 : -1}>
              Resume
            </a>
          </nav>
        </StyledSidebar>
      </div>
    </StyledMenu>
  );
};

export default Menu;
