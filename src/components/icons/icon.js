import React from 'react';
import PropTypes from 'prop-types';
import IconArrowLeft from './arrowLeft';
import IconExternal from './external';
import IconGitHub from './github';
import IconInstagram from './instagram';
import IconLinkedin from './linkedin';
import IconLogo from './logo';
import IconTwitter from './twitter';

const ICONS = {
  ArrowLeft: IconArrowLeft,
  External: IconExternal,
  GitHub: IconGitHub,
  Instagram: IconInstagram,
  Linkedin: IconLinkedin,
  Logo: IconLogo,
  Twitter: IconTwitter,
};

/** Renders an icon by name; unknown names fall back to the external-link icon. */
const Icon = ({ name }) => {
  const Component = ICONS[name] || IconExternal;
  return <Component />;
};

Icon.propTypes = {
  name: PropTypes.string.isRequired,
};

export default Icon;
