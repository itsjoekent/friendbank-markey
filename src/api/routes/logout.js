const apiErrorHandler = require('../utils/apiErrorHandler');

module.exports = ({ db }) => {
  async function logout(req, res) {
    try {
      const { token } = req;

      const tokens = db.collection('tokens');
      await tokens.findOneAndDelete({
        _id: token._id,
      });

      res.json({ ok: true });
    } catch (error) {
      apiErrorHandler(res, error);
    }
  }

  return logout;
};
