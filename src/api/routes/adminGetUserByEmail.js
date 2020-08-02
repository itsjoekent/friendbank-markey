const findUser = require('../db/findUser');
const apiErrorHandler = require('../utils/apiErrorHandler');
const validateAndNormalizeApiRequestFields = require('../utils/validateAndNormalizeApiRequestFields');
const transformUserResponse = require('../transformers/transformUserResponse');
const { STAFF_ROLE } = require('../../shared/roles');

module.exports = ({ db }) => {
  async function adminGetUserByEmail(req, res) {
    try {
      const {
        campaign,
        params: {
          email,
        },
        token,
      } = req;

      if (token.user.role !== STAFF_ROLE) {
        res.status(401).json({ error: 'Only staff can access this' });
        return;
      }

      if (token.user.campaign !== campaign._id.toString()) {
        res.status(401).json({ error: 'Only staff can access this' });
        return;
      }

      const validationResult = validateAndNormalizeApiRequestFields({ email });

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
        res.status(404).json({ error: 'User not found for this email' });
        return;
      }

      const baseUser = transformUserResponse(user);

      res.json({
        user: {
          ...baseUser,
          id: user._id.toString(),
        },
      });
    } catch (error) {
      apiErrorHandler(res, error);
    }
  }

  return adminGetUserByEmail;
}
