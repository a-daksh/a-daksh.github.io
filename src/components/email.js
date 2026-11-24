import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getEmail, openEmail } from '@utils/email';
import Side from './side';

const StyledLinkWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  &:after {
    content: '';
    display: block;
    width: 1px;
    height: 90px;
    margin: 0 auto;
    background-color: var(--color-text-secondary);
  }

  button {
    margin: 20px auto;
    padding: 10px;
    border: 0;
    background: none;
    color: var(--color-accent);
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
    letter-spacing: 0.1em;
    writing-mode: vertical-rl;
    transition: var(--transition);

    &:hover,
    &:focus-visible {
      transform: translateY(-3px);
    }
  }
`;

// Right-edge email rail. The address is filled in only in the browser (see src/utils/email.js),
// so it never appears in the page's HTML.
const Email = () => {
  const [address, setAddress] = useState('');
  useEffect(() => setAddress(getEmail()), []);

  return (
    <Side orientation="right">
      <StyledLinkWrapper>
        {address && (
          <button type="button" onClick={openEmail} aria-label={`Email ${address}`}>
            {address}
          </button>
        )}
      </StyledLinkWrapper>
    </Side>
  );
};

export default Email;
