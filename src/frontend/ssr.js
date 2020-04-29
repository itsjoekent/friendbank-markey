import { renderToString } from 'react-dom';
import Application from './Application';

module.exports = (data) => {
  return renderToString(<Application {...data} />);
}
