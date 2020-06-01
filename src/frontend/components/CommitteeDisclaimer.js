import React from 'react';
import styled from 'styled-components';
import getCopy from '../utils/getCopy';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

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

  margin-bottom: 12px;
`;

const PrivacyPolicyLink = styled.a`
  font-family: ${({ theme }) => theme.fonts.mainFamily};
  font-weight: normal;
  font-size: 12px;
  text-decoration: underline;
  text-align: center;
  padding: 0;
  margin: 0;
  border: none;
  background: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.blue};

  &:hover {
    color: ${({ theme }) => theme.colors.black};
  }
`;

export default function CommitteeDisclaimer() {
  return (
    <Container>
      <Disclaimer>
        {getCopy('politicalDiclaimer')}
      </Disclaimer>
      <PrivacyPolicyLink href={getCopy('privacyPolicy.link')}>
        {getCopy('privacyPolicy.label')}
      </PrivacyPolicyLink>
    </Container>
  );
}
