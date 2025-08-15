import React from 'react';
import PropTypes from 'prop-types';
import {
  IconArrowLeft,
  IconExternal,
  IconGitHub,
  IconInstagram,
  IconLinkedin,
  IconLogo,
  IconTwitter,
} from '@components/icons';

const Icon = ({ name }) => {
  switch (name) {
    case 'ArrowLeft':
      return <IconArrowLeft />;
    case 'External':
      return <IconExternal />;
    case 'GitHub':
      return <IconGitHub />;
    case 'Instagram':
      return <IconInstagram />;
    case 'Linkedin':
      return <IconLinkedin />;
    case 'Logo':
      return <IconLogo />;
    case 'Twitter':
      return <IconTwitter />;
    default:
      return <IconExternal />;
  }
};

Icon.propTypes = {
  name: PropTypes.string.isRequired,
};

export default Icon;
