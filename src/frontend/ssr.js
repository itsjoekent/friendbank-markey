import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';
import Application from './Application';

export default function ssr(data) {
  const sheet = new ServerStyleSheet();
  let styleTags = null;
  let html = null;

  try {
    html = ReactDOMServer.renderToString(sheet.collectStyles(<Application {...data} />));
    styleTags = sheet.getStyleTags();
  } catch (error) {
    return error;
  } finally {
    sheet.seal();
  }

  return { html, styleTags };
}
