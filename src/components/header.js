import styled from 'styled-components';

/**
 * Fixed top bar shared by the home nav and the sub-page "Back" nav.
 * Mostly-opaque background + blur, so page content scrolling underneath never shows through
 * crisply behind the links (it used to be a 70%-opacity element, which faded the links too).
 */
const Header = styled.header`
  ${({ theme }) => theme.mixins.flexBetween};
  position: fixed;
  top: 0;
  z-index: 11;
  padding: 0 40px;
  width: 100%;
  height: var(--nav-height);
  background-color: rgba(var(--color-bg-primary-rgb), 0.88);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: var(--transition);

  @media (max-width: 1080px) {
    padding: 0 20px 0 25px;
  }
  @media (max-width: 768px) {
    padding: 0 25px;
  }
`;

export default Header;
