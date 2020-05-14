import { SPANISH_PREFIX } from '../../shared/lang';

export default function makeLocaleLink(path) {
  const isSpanish = location.pathname.startsWith(SPANISH_PREFIX);

  return isSpanish ? `${SPANISH_PREFIX}${path}` : path;
}
