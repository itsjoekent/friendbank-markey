const fetch = require('node-fetch');
const fieldUrlEncoder = require('../utils/fieldUrlEncoder');
const _writeServiceOutput = require('./_writeServiceOutput');

const {
  MAIL_DEBUG,
  BSD_API_BASE_URL,
} = process.env;

async function sendMail(
  to = '',
  templateId = '',
  templateData = {},
) {
  try {
    const url = `${BSD_API_BASE_URL}/page/api/mailer/send_triggered_email`;

    const body = fieldUrlEncoder({
      mailing_id: templateId,
      email: to,
      trigger_values: JSON.stringify(templateData),
    });

    const options = {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body,
    };

    if (MAIL_DEBUG) {
      await _writeServiceOutput('mail', { ...options, url });
      return true;
    }

    const response = await fetch(url, options);

    return response;
  } catch (error) {
    return error;
  }
}

module.exports = sendMail;
