const xss = require('xss');
const phoneValidation = require('phone');
const profanity = require('@2toad/profanity').profanity;
const normalizePageCode = require('../../shared/normalizePageCode');
const fieldValidations = require('../../shared/fieldValidations');

function profanityCheck(value) {
  return profanity.exists(value) ? 'validations.profanity' : false;
}

function normalizeName(value) {
  return xss(value.trim());
}

function normalizeEmail(value) {
  return value.trim().toLowerCase();
}

function normalizePhone(value) {
  return phoneValidation(value, '', true)[0];
}

module.exports = function validateAndNormalizeApiRequestFields(fields, customValidations = {}) {
  const validations = {
    firstName: [
      fieldValidations.validateName,
      profanityCheck,
    ],
    lastName: [
      fieldValidations.validateName,
    ],
    zip: customValidations.zip || [
      fieldValidations.validateZip,
    ],
    email: customValidations.email || [
      fieldValidations.validateEmail,
    ],
    phone: customValidations.phone || [
      fieldValidations.validatePhone,
    ],
    code: [
      fieldValidations.validateCode,
      profanityCheck,
    ],
    title: [
      fieldValidations.validateTitle,
      profanityCheck,
    ],
    subtitle: [
      fieldValidations.validateSubtitle,
      profanityCheck,
    ],
    supportLevel: [
      fieldValidations.validateRequired,
    ],
    volunteerLevel: [
      fieldValidations.validateRequired,
    ],
    background: [
      fieldValidations.validateBackground,
    ],
    emailFrequency: [
      fieldValidations.validateEmailFrequency,
    ],
    password: [
      fieldValidations.validatePassword,
    ],
  };

  const normalizations = {
    code: normalizePageCode,
    firstName: normalizeName,
    lastName: normalizeName,
    email: normalizeEmail,
    phone: normalizePhone,
    title: normalizeName,
    subtitle: normalizeName,
  };

  return Object.keys(fields).reduce((acc, key) => {
    if (Array.isArray(acc)) {
      return acc;
    }

    const value = `${fields[key] || ''}`;

    const validationMessage = validations[key]
      ? validations[key]
        .map((validator) => validator((value)))
        .find(validation => !!validation)
      : false;

    if (validationMessage) {
      return [key, validationMessage];
    }

    return {
      ...acc,
      [key]: normalizations[key] ? normalizations[key](value) : value,
    }
  }, {});
}
