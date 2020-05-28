import isSpanishPath from './isSpanishPath';
import { SPANISH_PREFIX } from '../../shared/lang';

export default function makeLocaleLink(path) {
  const isSpanish = isSpanishPath(location.pathname);

  return isSpanish ? `${SPANISH_PREFIX}${path}` : path;
}
