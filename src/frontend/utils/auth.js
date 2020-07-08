export function setAuthToken(token) {
  if (typeof localStorage === 'undefined') {
    return;
  }

  localStorage.setItem('token', token);
}

export function getAuthToken(token) {
  if (typeof localStorage === 'undefined') {
    return null;
  }

  return localStorage.getItem('token');
}

export function removeAuthToken() {
  if (typeof localStorage === 'undefined') {
    return null;
  }

  localStorage.removeItem('role');
  localStorage.removeItem('token');
}

export function isAuthenticated() {
  if (typeof localStorage === 'undefined') {
    return false;
  }

  return !!getAuthToken() && !!getAuthToken().length;
}

export function getRole() {
  if (typeof localStorage === 'undefined') {
    return null;
  }

  return localStorage.getItem('role');
}

export function setRole(role) {
  if (typeof localStorage === 'undefined') {
    return;
  }

  localStorage.setItem('role', role);
}

export function removeRole(role) {
  if (typeof localStorage === 'undefined') {
    return;
  }

  localStorage.removeItem('role', role);
}
