export function validateName(value) {
  if (!value) {
    return 'Required*';
  }

  if (value.length > 50) {
    return 'Must be less than 50 chars.';
  }

  return false;
}

export function validateZip(value) {
  if (!value) {
    return 'Required*';
  }

  if (value.length !== 5) {
    return 'Invalid zip';
  }

  return false;
}

export function validatePhone(value) {
  if (!value) {
    return 'Required*';
  }

  if (!/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(value)) {
    return 'Invalid phone number';
  }

  return false;
}

export function validateEmail(value) {
  if (!value) {
    return 'Required*';
  }

  if (!/\S+@\S+\.\S+/.test(value)) {
    return 'Invalid email format';
  }

  return false;
}

export function validateCode(value) {
  if (!value) {
    return 'Required*';
  }

  if (value.length > 50) {
    return 'Must be less than 50 chars.';
  }

  if (!(/^[a-zA-Z0-9-_]+$/.test(value))) {
    return 'Can only contain letters, numbers, dashes & underscores.';
  }

  return false;
}

export function validateRequired(value) {
  if (!value) {
    return 'Required*';
  }

  return false;
}
