import { SPANISH_PREFIX } from '../../shared/lang';

export default function isSpanishPath(path) {
  return (path.endsWith('/') ? path : `${path}/`).startsWith(`${SPANISH_PREFIX}/`);
}
