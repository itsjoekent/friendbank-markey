import React from 'react';
import styled from 'styled-components';

const Layout = styled.div`
  display: flex;
  flex-direction: column-reverse;
  width: 100%;
  min-height: 100vh;

  @media ${({ theme }) => theme.media.tablet} {
    flex-direction: row;
  }
`;

const ContentPanel = styled.main`
  display: flex;
  flex-direction: row;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.white};
  border-top: 4px solid ${({ theme }) => theme.colors.red};
  padding: 24px 16px;

  @media ${({ theme }) => theme.media.tablet} {
    width: 50%;
    height: 100vh;
    overflow-y: scroll;
    justify-content: center;
  }
`;

const ContentPanelContainer = styled.div`
  display: flex;
  flex-direction: column;

  @media ${({ theme }) => theme.media.tablet} {
    width: 100%;
    max-width: 500px;
    padding-top: 100px;
  }
`;

const MediaPanel = styled.div`
  width: 100%;
  height: 40vh;

  @media ${({ theme }) => theme.media.tablet} {
    width: 50%;
    height: 100vh;
  }
`;

const MediaImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`;

export default function SplitScreen(props) {
  const { children, media } = props;

  return (
    <Layout>
      <ContentPanel>
        <ContentPanelContainer>
          {children}
        </ContentPanelContainer>
      </ContentPanel>
      <MediaPanel>
        {media && media.type === 'image' && (
          <MediaImage src={media.source} alt={media.alt} />
        )}
      </MediaPanel>
    </Layout>
  );
}
