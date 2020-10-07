import React from 'react';
import styled from 'styled-components';

const MapLink = styled.a`
  display: block;
  font-family: ${({ theme }) => theme.fonts.mainFamily};
  font-weight: normal;
  font-size: 16px;
  text-decoration: underline;
  text-align: left;
  padding: 0;
  margin: 0;
  border: none;
  background: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.blue};

  margin-top: 16px;

  &:hover {
    color: ${({ theme }) => theme.colors.black};
  }
`;

export default function DownBallotMapLink() {
  return (
    <MapLink target="_blank" href="https://www.google.com/maps/d/u/0/viewer?mid=1ZwVSfAi95j4RIqMI2zAh-fmn_iAcdc9a&ll=42.247711842678186%2C-71.90446221297962&z=8">
      Downballot candidate map
    </MapLink>
  );
}
