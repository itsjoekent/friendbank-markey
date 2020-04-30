import React from 'react';
import styled from 'styled-components';

const Disclaimer = styled.span`
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-top: 72px;
  padding: 8px 16px;

  font-family: ${({ theme }) => theme.fonts.mainFamily};
  font-weight: normal;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.blue};
  border: 2px solid ${({ theme }) => theme.colors.blue};
`;

export const DisclaimerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  min-height: 80vh;
`;

export default function CommitteeDisclaimer() {
  return (
    <Disclaimer>
      PAID FOR BY THE MARKEY COMMITTEE
    </Disclaimer>
  );
}
