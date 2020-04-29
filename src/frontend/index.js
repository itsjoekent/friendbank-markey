import React from 'react';
import ReactDOM from 'react-dom';
import Application from './Application';

const data = window.__REACT_DATA;

ReactDOM.hydrate(
  <Application {...data} />,
  document.getElementById('react-app')
);
