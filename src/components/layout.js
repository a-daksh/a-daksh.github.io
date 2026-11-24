import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled, { ThemeProvider } from 'styled-components';
import { Nav, BackNav, Social, Email, Footer } from '@components';
import { GlobalStyle, theme } from '@styles';
import { ThemeProvider as SiteThemeProvider } from '@contexts/ThemeContext';
import { useBeepDetection } from '@hooks';
import Galaxy from './galaxy';

const SkipToContentLink = styled.a`
  position: absolute;
  top: auto;
  left: -999px;
  width: 1px;
  height: 1px;
  overflow: hidden;
  z-index: -99;
  &:focus,
  &:active {
    top: 0;
    left: 0;
    width: auto;
    height: auto;
    padding: 18px 23px;
    border-radius: var(--border-radius);
    background-color: var(--color-bg-secondary);
    color: var(--color-text-inverse);
    font-family: var(--font-mono);
    font-size: var(--fz-sm);
    line-height: 1;
    text-decoration: none;
    overflow: auto;
    z-index: 99;
  }
`;

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  min-height: var(--full-height);
`;

/**
 * Shared page shell. The home page gets the full section nav and the side rails;
 * every other page (archive, 404) gets a compact "Back" header.
 */
const Layout = ({ children, location }) => {
  const isHome = location.pathname === '/';
  const [showGalaxy, setShowGalaxy] = useState(false);

  // Easter egg: typing "beep" anywhere opens the galaxy.
  useBeepDetection(() => setShowGalaxy(true));

  // Arriving from another page with a hash (e.g. /#about): scroll to and focus that section.
  useEffect(() => {
    if (!location.hash) {
      return;
    }
    const el = document.getElementById(location.hash.substring(1));
    if (el) {
      el.scrollIntoView();
      el.focus({ preventScroll: true });
    }
  }, [location.hash]);

  // Page <head> tags come from each page's Gatsby `Head` export (see src/components/seo.js).
  return (
    <>
      <div id="root">
        <SiteThemeProvider>
          <ThemeProvider theme={theme}>
            <GlobalStyle />

            <SkipToContentLink href="#content">Skip to Content</SkipToContentLink>

            <StyledContent>
              {isHome ? <Nav /> : <BackNav />}
              {isHome && <Social />}
              {isHome && <Email />}

              <div id="content">
                {children}
                <Footer />
              </div>
            </StyledContent>

            {showGalaxy && <Galaxy onClose={() => setShowGalaxy(false)} />}
          </ThemeProvider>
        </SiteThemeProvider>
      </div>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object.isRequired,
};

export default Layout;
