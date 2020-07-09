import React from 'react';
import { getRole } from '../utils/auth';

export default function useRole() {
  const [role, setRole] = React.useState(null);

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (role !== getRole()) {
        setRole(getRole());
      }
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [role, setRole]);

  return role;
}
