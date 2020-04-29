import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Museo Sans';
    src: url('/fonts/MuseoSans700.woff2') format('woff2'),
      url('/fonts/MuseoSans700.woff') format('woff');
    font-weight: bold;
    font-style: normal;
  }

  @font-face {
    font-family: 'Museo Sans';
    src: url('/fonts/MuseoSans300.woff2') format('woff2'),
      url('/fonts/MuseoSans300.woff') format('woff');
    font-weight: normal;
    font-style: normal;
  }

  @font-face {
    font-family: 'Laca Text';
    src: url('/fonts/LacaTextBold.woff2') format('woff2'),
      url('/fonts/LacaTextBold.woff') format('woff');
    font-weight: bold;
    font-style: normal;
  }

  body,
  h1,
  h2,
  h3,
  h4,
  p,
  ul[class],
  ol[class],
  li,
  figure,
  figcaption,
  blockquote,
  dl,
  dd {
    margin: 0;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  ul[class],
  ol[class] {
    list-style: none;
    padding: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`;


export default GlobalStyle;
