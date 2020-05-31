import React from 'react';
import styled from 'styled-components';
import StandardHelmet from '../components/StandardHelmet';
import { FormTitleContainer } from '../components/Form';
import makeLocaleLink from '../utils/makeLocaleLink';

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 80vh;
  margin-bottom: 48px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadow};

  ${FormTitleContainer} {
    margin-bottom: 0;
  }
`;

const LinkRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  margin-top: 48px;
`;

const Link = styled.a`
  font-family: ${({ theme }) => theme.fonts.mainFamily};
  font-weight: normal;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.blue};
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

export default function Gateway(props) {
  const {
    children,
    preContainerChildren,
    leftLink,
    rightLink,
  } = props;

  return (
    <Layout>
      <StandardHelmet />
      {!!preContainerChildren && preContainerChildren}
      <Container>
        {children}
        <LinkRow>
          {leftLink && (
            <Link href={makeLocaleLink(leftLink.path)}>
              {leftLink.copy}
            </Link>
          )}
          {rightLink && (
            <Link href={makeLocaleLink(rightLink.path)}>
              {rightLink.copy}
            </Link>
          )}
        </LinkRow>
      </Container>
    </Layout>
  );
}
