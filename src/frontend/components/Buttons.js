import styled from 'styled-components';

export const BaseButton = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  font-family: ${({ theme }) => theme.fonts.headerFamily};
  font-weight: bold;
  font-size: 20px;
  line-height: 1;
  text-align: center;
  text-transform: uppercase;
  text-decoration: none;
  cursor: pointer;
  user-select: none;
  padding: 8px 16px;
`;

export const RedButton = styled(BaseButton)`
  border: 2px solid ${({ theme }) => theme.colors.red};
  background-color: ${({ theme }) => theme.colors.red};
  color: ${({ theme }) => theme.colors.white};

  &:hover {
    background-color: transparent;
    color: ${({ theme }) => theme.colors.red};
  }
`;
