import 'whatwg-fetch';

import React from 'react';
import ReactDOM from 'react-dom';
import { loadableReady } from '@loadable/component';
import Application from './Application';

const data = window.__REACT_DATA;

loadableReady(() => {
  ReactDOM.hydrate(
    <Application {...data} />,
    document.getElementById('react-app')
  );
});
