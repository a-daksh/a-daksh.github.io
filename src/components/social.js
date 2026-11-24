import React from 'react';
import styled from 'styled-components';
import { socialMedia } from '@config';
import { Icon } from '@components/icons';
import Side from './side';

const StyledSocialList = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0;
  padding: 0;
  list-style: none;

  &:after {
    content: '';
    display: block;
    width: 1px;
    height: 90px;
    margin: 0 auto;
    background-color: var(--color-text-secondary);
  }

  li {
    &:last-of-type {
      margin-bottom: 20px;
    }

    a {
      padding: 10px;

      &:hover,
      &:focus {
        transform: translateY(-3px);
      }

      svg {
        width: 20px;
        height: 20px;
      }
    }
  }
`;

const Social = () => (
  <Side orientation="left">
    <StyledSocialList>
      {socialMedia.map(({ url, name }) => (
        <li key={name}>
          <a href={url} aria-label={name} target="_blank" rel="noopener noreferrer">
            <Icon name={name} />
          </a>
        </li>
      ))}
    </StyledSocialList>
  </Side>
);

export default Social;
