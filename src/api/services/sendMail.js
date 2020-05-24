const sgMail = require('@sendgrid/mail');
const _writeServiceOutput = require('./_writeServiceOutput');

const { SENDGRID_API_KEY, SENDGRID_DEBUG } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

async function sendMail(
  to = '',
  templateId = '',
  templateData = {},
) {
  try {
    const message = {
      to,
      templateId,
      dynamic_template_data: templateData,
      from: 'info@friendbank.us',
      mailSettings: {
        sandboxMode: {
          enable: !!SENDGRID_DEBUG,
        },
      },
    };

    if (SENDGRID_DEBUG) {
      await _writeServiceOutput('mail', message);
    }

    await sgMail.send(message);
  } catch (error) {
    // Catch full nested Sendgrid error response
    error.message = error.response ? JSON.stringify(error) : error.message;

    return error;
  }
}

module.exports = sendMail;
