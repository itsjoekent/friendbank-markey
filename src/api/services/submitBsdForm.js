const fetch = require('node-fetch');
const _writeServiceOutput = require('./_writeServiceOutput');

const {
  DISABLE_BSD,
  BSD_API_BASE_URL,
  BSD_SIGNUP_FORM_SLUG,
} = process.env;

module.exports = async function submitBsdForm(slug, fields) {
  try {
    const url = `${BSD_API_BASE_URL}/page/sapi/${slug}`;

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

    if (DISABLE_BSD) {
      await _writeServiceOutput('bsd', { ...options, url });
      return true;
    }

    const response = await fetch(url, options);

    return response;
  } catch (error) {
    return error;
  }
}
