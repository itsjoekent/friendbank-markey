import React from 'react';
import makeApiRequest from '../utils/makeApiRequest';

export default function useGetUserRole() {
  const [role, setRole] = React.useState(null);

  React.useEffect(() => {
    if (role) return;

    if (localStorage.getItem('role')) {
      setRole(localStorage.getItem('role'));
    }

    makeApiRequest('/api/v1/user', 'get', null, false).then(({ json }) => {
      if (!role && json && json.user && json.user.role) {
        setRole(json.user.role);
        localStorage.setItem('role', json.user.role);
      }
    });
  }, [role, setRole]);

  return role;
}
