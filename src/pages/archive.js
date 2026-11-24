import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Layout, Seo, Projects } from '@components';

// "&&" doubles the class specificity so this top padding wins over the global `main.fillHeight` rule.
const StyledMainContainer = styled.main`
  counter-reset: section;

  && {
    padding-top: calc(var(--nav-height) + 50px);
  }
`;

const ArchivePage = ({ location }) => (
  <Layout location={location}>
    <StyledMainContainer className="fillHeight">
      <Projects />
    </StyledMainContainer>
  </Layout>
);

ArchivePage.propTypes = {
  location: PropTypes.object.isRequired,
};

export const Head = ({ location }) => (
  <Seo
    pathname={location.pathname}
    title="Project Archive"
    description="Earlier robotics and engineering projects by Daksh Adhar: drones, rovers, assistive devices, and more."
  />
);

Head.propTypes = {
  location: PropTypes.shape({ pathname: PropTypes.string.isRequired }).isRequired,
};

export default ArchivePage;
