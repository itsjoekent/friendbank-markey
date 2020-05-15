import React from 'react';
import styled from 'styled-components';
import getCopy from '../utils/getCopy';
import { RedButton } from './Buttons';
import makeLocaleLink from '../utils/makeLocaleLink';

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
        <Logo href={makeLocaleLink("/")}>
          <img src="https://ed-markey-supporter-photos.s3.amazonaws.com/logo.png" alt={getCopy('nav.logoAlt')} />
        </Logo>
        <NavItemsContainer>
          <Redirect href={getCopy('nav.returnLink')}>{getCopy('nav.return')}</Redirect>
          <DonateButton as="a" href={getCopy('nav.donateForm')}>{getCopy('nav.donate')}</DonateButton>
        </NavItemsContainer>
      </NavInnerContainer>
    </NavContainer>
  );
}
