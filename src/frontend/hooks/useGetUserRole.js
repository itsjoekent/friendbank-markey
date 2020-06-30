import React from 'react';
import makeApiRequest from '../utils/makeApiRequest';
import { isAuthenticated } from '../utils/auth';

export default function useGetUserRole(enableAuthorizationRedirect = false) {
  const [role, setRole] = React.useState(null);

  React.useEffect(() => {
    if (!!role || !isAuthenticated()) {
      return;
    }

    const cachedRole = localStorage.getItem('role');
    if (cachedRole) {
      setRole(cachedRole);
    }

    makeApiRequest('/api/v1/user', 'get', null, enableAuthorizationRedirect)
      .then(({ json }) => {
        if (!role && json && json.user && json.user.role) {
          setRole(json.user.role);
          localStorage.setItem('role', json.user.role);
        }
      });
  }, [role, setRole]);

  return role;
}
