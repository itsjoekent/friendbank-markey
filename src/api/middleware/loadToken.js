const { ObjectId } = require('mongodb');
const getToken = require('../db/getToken');
const apiErrorHandler = require('../utils/apiErrorHandler');

module.exports = ({ db }) => {
  async function loadToken(req, res, next) {
    try {
      const tokenValue = req.get('x-relational-token');

      if (!tokenValue) {
        res.status(401).json({ error: 'Missing authorization token' });
        return;
      }

      const token = await getToken(db, tokenValue);

      if (token instanceof Error) {
        throw token;
      }

      if (!token) {
        res.status(401).json({ error: 'Missing authorization token' });
        return;
      }

      if (token.lauCompare !== token.user.lastAuthenticationUpdate) {
        res.status(401).json({ error: 'Authorization token expired' });
        return;
      }

      req.token = token;
      next();
    } catch (error) {
      apiErrorHandler(res, error);
    }
  }

  return loadToken;
};
