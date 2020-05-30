import getCopy from './getCopy';
import { getAuthToken, setAuthToken } from './auth';
import makeLocaleLink from './makeLocaleLink';
import { LOGIN_ROUTE, NOT_AUTHORIZED_QUERY } from '../pages/Login';

export default async function makeApiRequest(path, method, data, enableAuthorizationRedirect = true) {
  try {
    const headers = { 'Content-Type': 'application/json' };

    if (getAuthToken()) {
      headers['X-Relational-Token'] = getAuthToken();
    }

    const response = await fetch(path, {
      method,
      body: JSON.stringify(data),
      headers,
    });

    const json = await response.json();

    if (response.status === 401 && enableAuthorizationRedirect) {
      window.location.href = makeLocaleLink(`${LOGIN_ROUTE}?${NOT_AUTHORIZED_QUERY}`);
    }

    if (response.status >= 400) {
      const { field, error } = json;
      console.error({ field, error });

      return {
        response,
        json,
        errorMessage: [
          getCopy(error, true, null) || getCopy('genericError'),
          getCopy(`formLabels.${field}`, true, null) || null,
        ],
      }
    }

    if (json.token) {
      setAuthToken(json.token);
    }

    return { response, json };
  } catch (error) {
    console.error(error);
    return { errorMessage: [getCopy('genericError'), null] };
  }
}
