import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { revealConfig } from '@config';
import { openEmail } from '@utils/email';
import { reveal } from '@utils/reveal';

const StyledContactSection = styled.section`
  max-width: 600px;
  margin: 0 auto 100px;
  text-align: center;

  @media (max-width: 768px) {
    margin: 0 auto 50px;
  }

  .overline {
    display: block;
    margin-bottom: 20px;
    color: var(--color-accent);
    font-family: var(--font-mono);
    font-size: var(--fz-md);
    font-weight: 400;

    &:before {
      bottom: 0;
      font-size: var(--fz-sm);
    }

    &:after {
      display: none;
    }
  }

  .title {
    font-size: clamp(40px, 5vw, 60px);
  }

  .email-link {
    ${({ theme }) => theme.mixins.bigButton};
    display: inline-block;
    margin-top: 50px;
  }
`;

const Contact = () => {
  const revealContainer = useRef(null);
  useEffect(() => reveal(revealContainer.current, revealConfig()), []);

  return (
    <StyledContactSection id="contact" ref={revealContainer}>
      <h2 className="title">Get In Touch</h2>

      <p>Whether you have a question or just want to say hi! My inbox is always open.</p>

      {/* The mailto: link is built only on click, so the address isn't in the HTML (src/utils/email.js). */}
      <button type="button" className="email-link" onClick={openEmail}>
        Say Hello
      </button>
    </StyledContactSection>
  );
};

export default Contact;
