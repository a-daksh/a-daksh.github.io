import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ArchiveLayout, Projects } from '@components';

const StyledMainContainer = styled.main`
  counter-reset: section;
  padding-top: 150px;
  
  @media (max-width: 768px) {
    padding-top: 120px;
  }
`;

const ArchivePage = ({ location }) => (
  <ArchiveLayout location={location}>
    <StyledMainContainer className="fillHeight">
      <Projects />
    </StyledMainContainer>
  </ArchiveLayout>
);

ArchivePage.propTypes = {
  location: PropTypes.object.isRequired,
};

export default ArchivePage;