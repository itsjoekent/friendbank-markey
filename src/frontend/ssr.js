import { renderToString } from 'react-dom';
import Application from './Application';

export default function ssr(data) {
  return renderToString(<Application {...data} />);
}
