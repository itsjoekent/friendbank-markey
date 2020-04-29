import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Application from './Application';

export default function ssr(data) {
  return ReactDOMServer.renderToString(<Application {...data} />);
}
