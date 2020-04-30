import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import copyToClipboard from 'copy-to-clipboard';
import copy from '../../copy';

export const DARK_THEME = 'DARK_THEME';
export const LIGHT_THEME = 'LIGHT_THEME';

export const ShareContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 480px;
  margin-left: auto;
  margin-right: auto;

  @media ${({ theme }) => theme.media.tablet} {
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
  }
`;

const themeMap = {
  primary: {
    [DARK_THEME]: 'blue',
    [LIGHT_THEME]: 'white',
  },
  icon: {
    [DARK_THEME]: 'blue',
    [LIGHT_THEME]: 'blue',
  },
  alt: {
    [DARK_THEME]: 'darkBlue',
    [LIGHT_THEME]: 'darkBlue',
  },
};

function getShareThemeColor(theme, key = 'primary') {
  return theme.colors[themeMap[key][theme.shareTheme]];
}

const ShareButtonCopy = styled.p`
  font-family: ${({ theme }) => theme.fonts.mainFamily};
  font-weight: bold;
  font-size: 14px;
  color: ${({ theme }) => getShareThemeColor(theme)};
  padding: 8px 16px;
  text-transform: uppercase;
  text-align: center;
  flex-grow: 1;
`;

const ShareButtonIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;

  i {
    color: ${({ theme }) => getShareThemeColor(theme)};
  }
`;

const ShareButton = styled.a`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: transparent;
  border: 2px solid ${({ theme }) => getShareThemeColor(theme)};
  text-decoration: none;
  width: 100%;
  padding: 4px;
  cursor: pointer;
  margin-bottom: 16px;

  &:hover {
    border: 2px solid ${({ theme }) => getShareThemeColor(theme, 'alt')};
    background-color: ${({ theme }) => getShareThemeColor(theme, 'alt')};

    ${ShareButtonCopy} {
      color: ${({ theme }) => theme.colors.white};
    }

    ${ShareButtonIcon} {
      background-color: ${({ theme }) => getShareThemeColor(theme, 'alt')};

      i {
        color: ${({ theme }) => getShareThemeColor(theme, 'primary')};
      }
    }
  }

  @media ${({ theme }) => theme.media.tablet} {
    width: calc(50% - 8px);
  }
`;

export default function ShareWidget(props) {
  const {
    theme = LIGHT_THEME,
    customShareText = '',
  } = props;

  const shareLink = (`${window.location.origin}${window.location.pathname}`).toLowerCase();

  const facebookLink = `https://www.facebook.com/sharer/sharer.php?href=${encodeURIComponent(shareLink)}&quote=${encodeURIComponent(customShareText || '')}`;
  const twitterLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${customShareText || ''}\n${shareLink}`)}`;
  const emailLink = `mailto:yourfriend@gmail.com?body=${encodeURIComponent(`${customShareText || ''}\n${shareLink}`)}`;

  function onCopy() {
    copyToClipboard(shareLink);
  }

  return (
    <ThemeProvider theme={(pre) => ({ ...pre, shareTheme: theme })}>
      <ShareContainer>
        <ShareButton target="_blank" rel="noopener noreferrer" href={facebookLink}>
          <ShareButtonIcon>
            <i className="fab fa-facebook-square fa-lg" />
          </ShareButtonIcon>
          <ShareButtonCopy>
            {copy.share.facebook}
          </ShareButtonCopy>
        </ShareButton>
        <ShareButton target="_blank" rel="noopener noreferrer" href={twitterLink}>
          <ShareButtonIcon>
            <i className="fab fa-twitter-square fa-lg" />
          </ShareButtonIcon>
          <ShareButtonCopy>
            {copy.share.twitter}
          </ShareButtonCopy>
        </ShareButton>
        <ShareButton target="_blank" rel="noopener noreferrer" href={emailLink}>
          <ShareButtonIcon>
            <i className="fas fa-envelope-square fa-lg" />
          </ShareButtonIcon>
          <ShareButtonCopy>
            {copy.share.email}
          </ShareButtonCopy>
        </ShareButton>
        <ShareButton as="button" onClick={onCopy}>
          <ShareButtonIcon>
            <i className="fas fa-copy fa-lg" />
          </ShareButtonIcon>
          <ShareButtonCopy>
            {copy.share.link}
          </ShareButtonCopy>
        </ShareButton>
      </ShareContainer>
    </ThemeProvider>
  );
}
