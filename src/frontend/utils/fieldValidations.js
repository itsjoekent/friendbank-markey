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

  if (/^[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(value)) {
    return 'Invalid phone number';
  }

  return false;
}
