const backgrounds = require('./backgrounds');
const emailFrequency = require('./emailFrequency');

function validateName(value) {
  if (!value) {
    return 'validations.required';
  }

  if (value.length > 50) {
    return 'validations.nameLength';
  }

  return false;
}

function validateZip(value) {
  if (!value) {
    return 'validations.required';
  }

  if (value.length !== 5) {
    return 'validations.zipFormat';
  }

  if (!/^\d+$/.test(value)) {
    return 'validations.zipFormat';
  }

  return false;
}

function validateZipNotRequired(value) {
  if (!value) {
    return false;
  }

  if (value.length !== 5) {
    return 'validations.zipFormat';
  }

  if (!/^\d+$/.test(value)) {
    return 'validations.zipFormat';
  }

  return false;
}

function validatePhone(value) {
  if (!value) {
    return 'validations.required';
  }

  if (!/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(value)) {
    return 'validations.phoneFormat';
  }

  return false;
}

function validatePhoneNotRequired(value) {
  if (!value) {
    return false;
  }

  if (!/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(value)) {
    return 'validations.phoneFormat';
  }

  return false;
}

function validateEmail(value) {
  if (!value) {
    return 'validations.required';
  }

  if (!/\S+@\S+\.\S+/.test(value)) {
    return 'validations.emailFormat';
  }

  return false;
}

function validateCode(value) {
  if (!value) {
    return 'validations.required';
  }

  if (value.length > 50) {
    return 'validations.codeLength';
  }

  if (!(/^[a-zA-Z0-9-_]+$/.test(value))) {
    return 'validations.codeFormat';
  }

  return false;
}

function validateRequired(value) {
  if (!value) {
    return 'validations.required';
  }

  return false;
}

function validateTitle(value) {
  if (!value) {
    return 'validations.required';
  }

  if (value.length > 450) {
    return 'validations.titleLength';
  }

  return false;
}

function validateSubtitle(value) {
  if (!value) {
    return 'validations.required';
  }

  if (value.length > 2000) {
    return 'validations.subtitleLength';
  }

  return false;
}

function validateBackground(value) {
  if (!value) {
    return 'validations.required';
  }

  if (!backgrounds[value]) {
    return 'validations.required';
  }

  return false;
}

function validateEmailFrequency(value) {
  if (!value) {
    return 'validations.required';
  }

  if (!emailFrequency[value]) {
    return 'validations.required';
  }

  return false;
}

function validatePassword(value) {
  if (!value) {
    return 'validations.required';
  }

  if (value.length < 8) {
    return 'validations.passwordLength';
  }

  return false;
}

module.exports = {
  validateName,
  validateZip,
  validateZipNotRequired,
  validatePhone,
  validatePhoneNotRequired,
  validateEmail,
  validateCode,
  validateRequired,
  validateTitle,
  validateSubtitle,
  validateBackground,
  validateEmailFrequency,
  validatePassword,
}
