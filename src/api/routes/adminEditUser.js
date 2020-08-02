const { ObjectID } = require('mongodb');
const findUser = require('../db/findUser');
const validateAndNormalizeApiRequestFields = require('../utils/validateAndNormalizeApiRequestFields');
const { passwordHash } = require('../utils/auth');
const apiErrorHandler = require('../utils/apiErrorHandler');
const { STAFF_ROLE } = require('../../shared/roles');

module.exports = ({ db }) => {
  async function adminEditUser(req, res) {
    try {
      const {
        token,
        body: {
          email,
          password,
        },
        campaign,
        params: {
          userId,
        },
      } = req;

      if (token.user.role !== STAFF_ROLE) {
        res.status(401).json({ error: 'Only staff can access this' });
        return;
      }

      if (token.user.campaign !== campaign._id.toString()) {
        res.status(401).json({ error: 'Only staff can access this' });
        return;
      }

      const inputs = {
        email,
        password,
      };

      const validationRequirements = Object.keys(inputs)
        .filter((key) => typeof inputs[key] !== 'undefined' && !!inputs[key].length)
        .reduce((acc, key) => ({ ...acc, [key]: inputs[key] }), {});

      const validationResult = validateAndNormalizeApiRequestFields(validationRequirements);

      if (Array.isArray(validationResult)) {
        res.status(400).json({
          field: validationResult[0],
          error: validationResult[1],
        });

        return;
      }

      const users = db.collection('users');
      const match = await users.findOne({ _id: ObjectID(userId) });

      if (!match) {
        res.status(404).json({ error: 'User does not exist' });
        return;
      }

      const userData = {
        ...validationResult,
        lastUpdatedAt: Date.now(),
      };

      if (userData.email) {
        const existingUser = await findUser(db, validationResult.email, campaign);

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
      }

      await users.updateOne(
        {
          _id: match._id,
        },
        {
          '$set': userData,
        },
      );

      res.json({ ok: true });
    } catch (error) {
      apiErrorHandler(res, error);
    }
  }

  return adminEditUser;
};
