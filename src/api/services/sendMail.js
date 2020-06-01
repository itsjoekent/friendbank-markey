const crypto = require('crypto');
const fetch = require('node-fetch');
const fieldUrlEncoder = require('../utils/fieldUrlEncoder');
const _writeServiceOutput = require('./_writeServiceOutput');

const {
  MAIL_DEBUG,
  BSD_API_BASE_URL,
} = process.env;

async function constructApiHmac(params) {
  const encoded = Object.keys(params).reduce((acc, key) => {
    const prepend = acc.length ? '&' : '';

    return `${acc}${prepend}${key}=${params[key]}`;
  }, '');

  const signingString = `${params.api_id}\n${params.api_ts}\n/page/api/mailer/send_triggered_email\n${encoded}`;

  const hmac = crypto.createHmac('sha1', process.env.BSD_API_KEY);
  hmac.setEncoding('hex');

  return new Promise((resolve) => {
    hmac.end(signingString, () => resolve(hmac.read()));
  });
}

async function sendMail(
  to = '',
  templateId = '',
  templateData = {},
) {
  try {
    const baseQueryParams = {
      api_id: process.env.BSD_API_CLIENT_ID,
      api_ts: Math.floor(Date.now() / 1000),
      api_ver: '2',
      mailing_id: templateId,
      email: to,
      // trigger_values: JSON.stringify(templateData).replace(/ /g, '+'),
      email_opt_in: 0,
    };

    const finalQueryParams = {
      ...baseQueryParams,
      api_mac: await constructApiHmac(baseQueryParams),
    };

    const url = `${BSD_API_BASE_URL}/page/api/mailer/send_triggered_email?${fieldUrlEncoder(finalQueryParams)}`;

    console.log(url);

    const options = {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
    };

    if (MAIL_DEBUG) {
      await _writeServiceOutput('mail', { ...options, url });
      return true;
    }

    const response = await fetch(url, options);
    const text = await response.text();
    console.log(response);

    if (response.status >= 400) {
      const text = await response.text();
      console.error(url, response.status, text);
    }

    return response;
  } catch (error) {
    return error;
  }
}
//http://support.edmarkey.com/friendbank/reset-password?token={{trigger.token}}

module.exports = sendMail;
