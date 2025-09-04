import React, { useState, useEffect } from 'react';
import { Link } from 'gatsby';
import { Helmet } from 'react-helmet';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import PropTypes from 'prop-types';
import styled, { ThemeProvider } from 'styled-components';
import { navDelay } from '@utils';
import { Head, Nav } from '@components';
import { GlobalStyle, theme } from '@styles';
import { ThemeProvider as CustomThemeProvider } from '../contexts/ThemeContext';

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const StyledMainContainer = styled.main`
  ${({ theme }) => theme.mixins.flexCenter};
  flex-direction: column;
  flex: 1;
`;

const StyledTitle = styled.h1`
  color: var(--color-accent);
  font-family: var(--font-mono);
  font-size: clamp(100px, 25vw, 200px);
  line-height: 1;
`;

const StyledSubtitle = styled.h2`
  font-size: clamp(30px, 5vw, 50px);
  font-weight: 400;
`;

const StyledRetryButton = styled(Link)`
  ${({ theme }) => theme.mixins.bigButton};
  margin-top: 40px;
`;

const NotFoundPage = ({ location }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsMounted(true), navDelay);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <Head />
      <div id="root">
        <CustomThemeProvider>
          <ThemeProvider theme={theme}>
            <GlobalStyle />
            <StyledContent>
              <Nav isHome={false} />
              <TransitionGroup component={null}>
                {isMounted && (
                  <CSSTransition timeout={500} classNames="fadeup">
                    <StyledMainContainer className="fillHeight">
                      <StyledTitle>404</StyledTitle>
                      <StyledSubtitle>Page Not Found</StyledSubtitle>
                      <StyledRetryButton to="/">Retry</StyledRetryButton>
                    </StyledMainContainer>
                  </CSSTransition>
                )}
              </TransitionGroup>
            </StyledContent>
          </ThemeProvider>
        </CustomThemeProvider>
      </div>
    </>
  );
};

NotFoundPage.propTypes = {
  location: PropTypes.object.isRequired,
};

export default NotFoundPage;
