import React from 'react';
import styled from 'styled-components';
import { RedButton } from './Buttons';

const NavContainer = styled.nav`
  position: absolute;
  z-index: ${({ theme }) => theme.zIndexes.nav};
  top: 0;
  left: 0;
  width: 100%;
`;

const NavInnerContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  width: 100%;
  max-width: ${({ theme }) => theme.max.site};
  margin-left: auto;
  margin-right: auto;
`;

const Logo = styled.a`
  margin-left: 8px;

  img {
    width: 60px;
  }

  @media ${({ theme }) => theme.media.tablet} {
    margin-left: 24px;

    img {
      width: 80px;
    }
  }
`;

const NavItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-end;
  height: fit-content;
  margin-top: 8px;
  margin-right: 8px;

  @media ${({ theme }) => theme.media.mobileLarge} {
    flex-direction: row;
    align-items: center;
    margin-top: 16px;
  }

  @media ${({ theme }) => theme.media.tablet} {
    margin-right: 24px;
  }
`;

export const Redirect = styled.a`
  display: block;
  font-family: ${({ theme }) => theme.fonts.headerFamily};
  font-weight: bold;
  font-size: 12px;
  line-height: 1;
  text-transform: uppercase;
  text-decoration: underline;
  color: ${({ theme }) => theme.colors.black};
  margin-bottom: 8px;

  &:hover {
    color: ${({ theme }) => theme.colors.blue};
  }

  @media ${({ theme }) => theme.media.mobileLarge} {
    margin-bottom: 0;
    margin-right: 20px;
  }
`;

const DonateButton = styled(RedButton)`
  font-size: 12px;
`;

export default function Nav(props) {
  return (
    <NavContainer>
      <NavInnerContainer>
        <Logo href="/">
          <img src="/assets/logo.png" alt="Ed Markey For Senate Logo" />
        </Logo>
        <NavItemsContainer>
          <Redirect href="https://www.edmarkey.com/">return to edmarkey.com</Redirect>
          <DonateButton as="a" href="https://secure.actblue.com/donate/ejm2020">Donate</DonateButton>
        </NavItemsContainer>
      </NavInnerContainer>
    </NavContainer>
  );
}
