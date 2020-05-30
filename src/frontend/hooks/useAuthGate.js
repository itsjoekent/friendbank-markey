import React from 'react';
import { isAuthenticated } from '../utils/auth';
import makeLocaleLink from '../utils/makeLocaleLink';
import { LOGIN_ROUTE, NOT_AUTHORIZED_QUERY } from '../pages/Login';

export default function useAuthGate() {
  React.useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = makeLocaleLink(`${LOGIN_ROUTE}?${NOT_AUTHORIZED_QUERY}`);
    }
  }, []);
}
