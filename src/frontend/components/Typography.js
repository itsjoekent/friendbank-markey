import styled from 'styled-components';

export const BaseTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.headerFamily};
  font-weight: bold;
  font-size: 28px;
  line-height: 1.1;
  text-transform: uppercase;

  @media ${({ theme }) => theme.media.tablet} {
    font-size: 36px;
  }
`;

export const DefaultTitle = styled(BaseTitle)`
  color: ${({ theme }) => theme.colors.blue};
  margin-bottom: 24px;
`;

export const BaseParagraph = styled.p`
  font-family: ${({ theme }) => theme.fonts.mainFamily};
  font-weight: normal;
  font-size: 18px;
`;

export const DefaultParagraph = styled(BaseParagraph)`
  color: ${({ theme }) => theme.colors.black};
  margin-bottom: 16px;
`;
