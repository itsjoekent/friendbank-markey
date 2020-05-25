const fetch = require('node-fetch');
const fieldUrlEncoder = require('../utils/fieldUrlEncoder');
const _writeServiceOutput = require('./_writeServiceOutput');

const {
  DEBUG_CRM_SIGNUP,
  BSD_API_BASE_URL,
  BSD_SIGNUP_FORM_SLUG,
} = process.env;

module.exports = async function submitBsdForm(slug, fields) {
  try {
    const url = `${BSD_API_BASE_URL}/page/sapi/${slug}`;

    const body = fieldUrlEncoder(fields);

    const options = {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body,
    };

    if (DEBUG_CRM_SIGNUP) {
      await _writeServiceOutput('bsd', { ...options, url });
      return true;
    }

    const response = await fetch(url, options);

    return response;
  } catch (error) {
    return error;
  }
}
