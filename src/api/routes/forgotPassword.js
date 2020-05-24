const ms = require('ms');
const sendMail = require('../services/sendMail');
const makeToken = require('../db/makeToken');
const getUser = require('../db/getUser');
const validateAndNormalizeApiRequestFields = require('../utils/validateAndNormalizeApiRequestFields');
const apiErrorHandler = require('../utils/apiErrorHandler');

module.exports = ({ db }) => {
  async function forgotPassword(req, res) {
    try {
      const {
        body: {
          email,
        },
      } = req;

      const validationResult = validateAndNormalizeApiRequestFields({ email });

      if (Array.isArray(validationResult)) {
        res.status(400).json({
          field: validationResult[0],
          error: validationResult[1],
        });

        return;
      }

      const user = await getUser(db, validationResult.email);

      if (user instanceof Error) {
        throw user;
      }

      if (user) {
        const resetToken = await makeToken(db, user, ms('1 hour'));

        const mailResult = await sendMail(
          user.email,
          process.env.SENDGRID_TEMPLATE_PASSWORD_RESET,
          {
            token: resetToken,
            accountEmail: user.email,
          },
        );

        if (mailResult instanceof Error) {
          throw mailResult;
        }
      }

      res.json({ ok: true });
    } catch (error) {
      apiErrorHandler(res, error);
    }
  }

  return forgotPassword;
};
