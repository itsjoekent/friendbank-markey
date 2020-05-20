const makeToken = require('../db/makeToken');
const getCampaignUser = require('../db/getCampaignUser');
const validateAndNormalizeApiRequestFields = require('../utils/validateAndNormalizeApiRequestFields');
const apiErrorHandler = require('../utils/apiErrorHandler');
const { passwordHash } = require('../utils/auth');

module.exports = ({ db }) => {
  async function createUser(req, res) {
    try {
      const {
        campaign,
        body: {
          email,
          password,
          firstName,
          zip,
          emailFrequency,
        },
      } = req;

      const validationResult = validateAndNormalizeApiRequestFields({
        email,
        password,
        firstName,
        zip,
        emailFrequency,
      });

      if (Array.isArray(validationResult)) {
        res.status(400).json({
          field: validationResult[0],
          error: validationResult[1],
        });

        return;
      }

      const existingUser = await getCampaignUser(db, campaign, email);

      if (existingUser instanceof Error) {
        throw existingUser;
      }

      if (existingUser) {
        res.status(409).json({ error: 'validations.existingUser' });
        return;
      }

      const hashedPassword = await passwordHash(validationResult.password);

      if (hashedPassword instanceof Error) {
        throw hashedPassword;
      }

      const userData = {
        campaign: campaign._id.toString(),
        email: validationResult.email,
        password: hashedPassword,
        firstName: validationResult.firstName,
        zip: validationResult.zip,
        emailFrequency: validationResult.emailFrequency,
        createdAt: Date.now(),
        lastUpdatedAt: Date.now(),
        lastAuthenticationUpdate: Date.now(),
      };

      const userInsertResult = await db.collection('users').insertOne(userData);
      const user = userInsertResult.ops[0];

      const token = await makeToken(db, user);

      if (token instanceof Error) {
        throw token;
      }

      res.json({ token });
    } catch (error) {
      apiErrorHandler(res, error);
    }
  }

  return createUser;
};
