import React from 'react';
import styled from 'styled-components';
import SplitScreen from '../components/SplitScreen';
import { DefaultTitle, DefaultParagraph } from '../components/Typography';
import backgrounds from '../../backgrounds';

export default function Homepage() {
  return (
    <SplitScreen media={backgrounds.default}>
      <DefaultTitle>
        make your own ed markey support page
      </DefaultTitle>
      <DefaultParagraph>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam
      </DefaultParagraph>
    </SplitScreen>
  );
}
