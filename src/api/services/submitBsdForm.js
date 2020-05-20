const fetch = require('node-fetch');

const {
  BSD_API_BASE_URL,
  BSD_SIGNUP_FORM_SLUG,
} = process.env;

module.exports = async function submitBsdForm(fields) {
  try {
    const url = `${BSD_API_BASE_URL}/page/sapi/${BSD_SIGNUP_FORM_SLUG}`;

    const body = Object.keys(fields).reduce((acc, key) => {
      const prepend = acc.length ? '&' : '';

      return `${acc}${prepend}${encodeURIComponent(key)}=${encodeURIComponent(fields[key])}`;
    }, '');

    const options = {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body,
    };

    const response = await fetch(url, options);

    return response;
  } catch (error) {
    return error;
  }
}
