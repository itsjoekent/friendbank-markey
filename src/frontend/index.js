import ReactDOM from 'react-dom';
import Application from './Application';

const data = window.REACT_DATA;

ReactDOM.hydrate(
  <Application {...data} />,
  document.getElementById('react-app')
);
