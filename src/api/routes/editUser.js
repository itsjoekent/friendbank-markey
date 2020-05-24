const makeToken = require('../db/makeToken');
const getUser = require('../db/getUser');
const transformUserResponse = require('../transformers/transformUserResponse');
const validateAndNormalizeApiRequestFields = require('../utils/validateAndNormalizeApiRequestFields');
const { passwordHash } = require('../utils/auth');
const apiErrorHandler = require('../utils/apiErrorHandler');

module.exports = ({ db }) => {
  async function editUser(req, res) {
    try {
      const {
        token,
        body: {
          email,
          password,
          firstName,
          zip,
          emailFrequency,
        },
      } = req;

      const inputs = {
        email,
        password,
        firstName,
        zip,
        emailFrequency,
      };

      const validationRequirements = Object.keys(inputs)
        .filter((key) => typeof inputs[key] !== 'undefined')
        .reduce((acc, key) => ({ ...acc, [key]: inputs[key] }), {});

      const validationResult = validateAndNormalizeApiRequestFields(validationRequirements);

      if (Array.isArray(validationResult)) {
        res.status(400).json({
          field: validationResult[0],
          error: validationResult[1],
        });

        return;
      }

      let newToken = null;

      const userData = {
        ...validationResult,
        lastUpdatedAt: Date.now(),
      };

      if (userData.email) {
        const existingUser = await getUser(db, validationResult.email);

        if (existingUser instanceof Error) {
          throw existingUser;
        }

        if (existingUser) {
          res.status(409).json({ error: 'validations.existingUser' });
          return;
        }
      }

      if (userData.password) {
        userData.lastAuthenticationUpdate = Date.now();

        const hashedPassword = await passwordHash(validationResult.password);

        if (hashedPassword instanceof Error) {
          throw hashedPassword;
        }

        userData.password = hashedPassword;

        newToken = await makeToken(db, {
          ...token.user,
          lastAuthenticationUpdate: userData.lastAuthenticationUpdate,
        });

        if (token instanceof Error) {
          throw token;
        }
      }

      const users = db.collection('users');

      await users.updateOne(
        {
          _id: token.user._id,
        },
        {
          '$set': userData,
        },
      );

      res.json({
        user: transformUserResponse({
          ...token.user,
          ...userData,
        }),
        token: newToken,
      });
    } catch (error) {
      apiErrorHandler(res, error);
    }
  }

  return editUser;
};
