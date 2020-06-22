const makeToken = require('../db/makeToken');
const findUser = require('../db/findUser');
const apiErrorHandler = require('../utils/apiErrorHandler');
const validateAndNormalizeApiRequestFields = require('../utils/validateAndNormalizeApiRequestFields');
const { passwordCompare } = require('../utils/auth');

module.exports = ({ db }) => {
  async function login(req, res) {
    try {
      const {
        campaign,
        body: {
          email,
          password,
        },
      } = req;

      const validationResult = validateAndNormalizeApiRequestFields({
        email,
        password,
      });

      if (Array.isArray(validationResult)) {
        res.status(400).json({
          field: validationResult[0],
          error: validationResult[1],
        });

        return;
      }

      const user = await findUser(db, validationResult.email, campaign);

      if (user instanceof Error) {
        throw user;
      }

      if (!user) {
        res.status(401).json({ error: 'validations.failedLogin' });
        return;
      }

      const isCorrectPassword = await passwordCompare(password, user.password);

      if (isCorrectPassword instanceof Error) {
        throw isCorrectPassword;
      }

      if (!isCorrectPassword) {
        res.status(401).json({ error: 'validations.failedLogin' });
        return;
      }

      const token = await makeToken(db, user);

      if (token instanceof Error) {
        throw token;
      }

      res.json({ token });
    } catch (error) {
      apiErrorHandler(res, error);
    }
  }

  return login;
};
