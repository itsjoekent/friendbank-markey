import React from 'react';
import styled from 'styled-components';
import { RedButton } from './Buttons';
import { LOGIN_ROUTE } from '../pages/Login';
import { HOMEPAGE_ROUTE } from '../pages/Homepage';
import { DASHBOARD_ROUTE } from '../pages/Dashboard';
import makeLocaleLink from '../utils/makeLocaleLink';
import isSpanishPath from '../utils/isSpanishPath';
import getCopy from '../utils/getCopy';
import getConfig from '../utils/getConfig';
import { isAuthenticated } from '../utils/auth';
import { ENGLISH, SPANISH, SPANISH_PREFIX } from '../../shared/lang';

const NavStack = styled.div`
  display: flex;
  flex-direction: column;
  box-shadow: ${({ theme }) => theme.shadow};

  @media ${({ theme }) => theme.media.tablet} {
    margin-bottom: 24px;
  }
`;

const NavContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  width: 100%;
  max-width: ${({ theme }) => theme.max.site};
  margin-left: auto;
  margin-right: auto;

  background-color: ${({ theme }) => theme.colors.white};
`;

const Logo = styled.a`
  margin-left: 8px;

  img {
    width: 50px;
    margin-bottom: 10px;
  }

  @media ${({ theme }) => theme.media.tablet} {
    margin-left: 24px;
  }
`;

const NavItemsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  flex-grow: 1;

  @media ${({ theme }) => theme.media.tablet} {
    margin-right: 24px;
  }
`;

const RightNavItemsRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

const NavItem = styled.a`
  font-family: ${({ theme }) => theme.fonts.mainFamily};
  font-weight: normal;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.black};
  cursor: pointer;
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.blue};
    text-decoration: underline;
  }
`;

const LeftLink = styled(NavItem)`
  @media ${({ theme }) => theme.media.tablet} {
    margin-left: 12px;
  }
`;

const RightLink = styled(NavItem)`
  @media ${({ theme, disableNavDonate }) => theme.media.tablet} {
    margin-right: ${({ disableNavDonate }) => disableNavDonate ? '0' : '24px'};
  }
`;

const RedirectRow = styled.div`
  display: flex;
  flex-direction: row;
`;

export const Redirect = styled.a`
  display: block;
  width: ${({ disableNavDonate }) => disableNavDonate ? '100%' : '66.66%'};
  color: ${({ theme }) => theme.colors.white};
  background-color: ${({ theme }) => theme.colors.blue};
  font-family: ${({ theme }) => theme.fonts.headerFamily};
  font-weight: bold;
  font-size: 12px;
  line-height: 1;
  text-transform: uppercase;
  text-decoration: none;
  text-align: center;
  padding: 6px;

  &:hover {
    text-decoration: underline;
  }

  @media ${({ theme }) => theme.media.tablet} {
    width: 100%;
    padding: 4px;
  }
`;

export const DonateRedirect = styled.a`
  display: block;
  width: 33.33%;
  color: ${({ theme }) => theme.colors.white};
  background-color: ${({ theme }) => theme.colors.red};
  font-family: ${({ theme }) => theme.fonts.headerFamily};
  font-weight: bold;
  font-size: 12px;
  line-height: 1;
  text-transform: uppercase;
  text-decoration: none;
  text-align: center;
  padding: 6px;

  &:hover {
    text-decoration: underline;
  }

  @media ${({ theme }) => theme.media.tablet} {
    display: none;
  }
`;

const DonateButton = styled(RedButton)`
  font-size: 12px;
  display: none;

  @media ${({ theme }) => theme.media.tablet} {
    display: flex;
  }
`;

export default function Nav(props) {
  const disableNavDonate = getConfig('disableNavDonate');

  const isSpanish = isSpanishPath(location.pathname);

  const languageLink = isSpanish
    ? location.pathname.replace(SPANISH_PREFIX, '')
    : `${SPANISH_PREFIX}${location.pathname}`;

  const [rightLink, setRightLink] = React.useState(
    [makeLocaleLink(LOGIN_ROUTE), getCopy('nav.login')],
  );

  React.useEffect(() => {
    setRightLink([
      makeLocaleLink(isAuthenticated() ? DASHBOARD_ROUTE : LOGIN_ROUTE),
      isAuthenticated() ? getCopy('nav.dashboard') : getCopy('nav.login'),
    ]);
  }, []);

  return (
    <NavStack>
      <RedirectRow>
        <Redirect href={getCopy('nav.returnLink')} disableNavDonate={disableNavDonate}>
          {getCopy('nav.return')}
        </Redirect>
        {!disableNavDonate && (
          <DonateRedirect href={getCopy('nav.donateForm')}>
            {getCopy('nav.donate')}
          </DonateRedirect>
        )}
      </RedirectRow>
      <NavContainer>
        <Logo href={makeLocaleLink(HOMEPAGE_ROUTE)}>
          <img src="https://ed-markey-supporter-photos.s3.amazonaws.com/logo.png" alt={getCopy('nav.logoAlt')} />
        </Logo>
        <NavItemsContainer>
          <LeftLink href={languageLink}>
            {getCopy('nav.language')}
          </LeftLink>
          <RightNavItemsRow>
            <RightLink href={rightLink[0]} disableNavDonate={disableNavDonate}>
              {rightLink[1]}
            </RightLink>
            {!disableNavDonate && (
              <DonateButton as="a" href={getCopy('nav.donateForm')}>
                {getCopy('nav.donate')}
              </DonateButton>
            )}
          </RightNavItemsRow>
        </NavItemsContainer>
      </NavContainer>
    </NavStack>
  );
}
