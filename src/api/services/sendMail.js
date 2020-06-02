const mail = require('@sendgrid/mail');
const _writeServiceOutput = require('./_writeServiceOutput');

const {
  MAIL_DEBUG,
  MAIL_FROM,
  SENDGRID_API_KEY,
} = process.env;

async function sendMail(
  to = '',
  templateId = '',
  templateData = {},
) {
  try {
    mail.setApiKey(SENDGRID_API_KEY);

    const message = {
      to,
      from: MAIL_FROM,
      templateId,
      dynamic_template_data: templateData,
    };

    if (MAIL_DEBUG) {
      message.mailSettings = {
        sandboxMode: {
          enable: true,
        },
      };
      
      await _writeServiceOutput('mail', message);
    }

    await mail.send(message);
  } catch (error) {
    return error;
  }
}

module.exports = sendMail;
