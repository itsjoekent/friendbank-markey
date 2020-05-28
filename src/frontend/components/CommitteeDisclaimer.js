import React from 'react';
import styled from 'styled-components';
import getCopy from '../utils/getCopy';

const Disclaimer = styled.span`
  display: block;
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
  padding: 8px 16px;

  font-family: ${({ theme }) => theme.fonts.mainFamily};
  font-weight: normal;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.blue};
  border: 2px solid ${({ theme }) => theme.colors.blue};
`;

export default function CommitteeDisclaimer() {
  return (
    <Disclaimer>
      {getCopy('politicalDiclaimer')}
    </Disclaimer>
  );
}
