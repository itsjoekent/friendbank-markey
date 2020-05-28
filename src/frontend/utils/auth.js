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

export function isAuthenticated() {
  if (typeof localStorage === 'undefined') {
    return false;
  }

  return !!getAuthToken() && !!getAuthToken().length;
}
