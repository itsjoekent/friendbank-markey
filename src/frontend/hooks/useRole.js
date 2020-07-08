import React from 'react';
import { getRole } from '../utils/auth';

export default function useRole() {
  const [role, setRole] = React.useState(null);

  React.useEffect(() => {
    setTimeout(() => setRole(getRole() || null));
  }, [setRole]);

  return role;
}
