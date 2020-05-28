import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Helmet } from 'react-helmet';
import { ServerStyleSheet } from 'styled-components';
import Application from './Application';
import router from './router';

export default async function ssr(path, ssrHelpers) {
  const [routeMatch, getProps, PageComponent] = router(path);

  let initialProps = {};

  if (typeof getProps === 'function') {
    try {
      initialProps = await getProps({
        ...ssrHelpers,
        routeMatch,
      });

      if (initialProps instanceof Error) {
        return initialProps;
      }
    } catch (error) {
      return error;
    }
  }

  const data = {
    ...initialProps,
    routeMatch,
    PageComponent,
  };

  const sheet = new ServerStyleSheet();
  let styleTags = null;
  let html = null;
  let headTags = null;

  try {
    html = ReactDOMServer.renderToString(
      sheet.collectStyles(<Application {...data} />),
    );

    styleTags = sheet.getStyleTags();

    const helmet = Helmet.renderStatic();

    headTags = `${helmet.title.toString()}\n${helmet.meta.toString()}`;
  } catch (error) {
    return error;
  } finally {
    sheet.seal();
  }

  return {
    html,
    styleTags,
    headTags,
    initialProps: {
      ...initialProps,
      routeMatch,
    },
  };
}
