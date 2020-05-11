import copy from '../../copy';

export function validateName(value) {
  if (!value) {
    return copy('validations.required');
  }

  if (value.length > 50) {
    return copy('validations.nameLength');
  }

  return false;
}

export function validateZip(value) {
  if (!value) {
    return copy('validations.required');
  }

  if (value.length !== 5) {
    return copy('validations.zipFormat');
  }

  return false;
}

export function validatePhone(value) {
  if (!value) {
    return copy('validations.required');
  }

  if (!/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(value)) {
    return copy('validations.phoneFormat');
  }

  return false;
}

export function validateEmail(value) {
  if (!value) {
    return copy('validations.required');
  }

  if (!/\S+@\S+\.\S+/.test(value)) {
    return copy('validations.emailFormat');
  }

  return false;
}

export function validateCode(value) {
  if (!value) {
    return copy('validations.required');
  }

  if (value.length > 50) {
    return copy('validations.codeLength');
  }

  if (!(/^[a-zA-Z0-9-_]+$/.test(value))) {
    return copy('validations.codeFormat');
  }

  return false;
}

export function validateRequired(value) {
  if (!value) {
    return copy('validations.required');
  }

  return false;
}
