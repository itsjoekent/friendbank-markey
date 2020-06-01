import React from 'react';
import styled from 'styled-components';
import getCopy from '../utils/getCopy';
import Gateway from '../components/Gateway';
import makeLocaleLink from '../utils/makeLocaleLink';

const Banner = styled.p`
  display: block;
  font-family: ${({ theme }) => theme.fonts.mainFamily};
  font-weight: bold;
  font-size: 18px;
  text-align: center;
  width: 100%;
  max-width: 400px;
  color: ${({ theme }) => theme.colors.darkBlue};
`;

export default function _404() {
  return (
    <Gateway>
      <Banner>
        {getCopy('pageNotFound')}
      </Banner>
    </Gateway>
  );
}
