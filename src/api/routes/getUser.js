const apiErrorHandler = require('../utils/apiErrorHandler');
const transformUserResponse = require('../transformers/transformUserResponse');

module.exports = ({ db }) => {
  async function getUser(req, res) {
    try {
      const { token } = req;

      res.json({ user: transformUserResponse(token.user) });
    } catch (error) {
      apiErrorHandler(res, error);
    }
  }

  return getUser;
}
