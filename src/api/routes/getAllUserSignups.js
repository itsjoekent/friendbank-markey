const { ObjectId } = require('mongodb');
const apiErrorHandler = require('../utils/apiErrorHandler');
const transformSignupResponse = require('../transformers/transformSignupResponse');

module.exports = ({ db }) => {
  async function getAllUserSignups(req, res) {
    try {
      const {
        campaign,
        token,
      } = req;

      const signups = db.collection('signups');

      const query = {
        campaign: campaign._id.toString(),
        recruitedBy: token.user._id.toString(),
      };

      const result = await signups.find(query, { limit: 1000 }).sort({ _id: -1 }).toArray();

      res.json({
        signups: (result || []).map(transformSignupResponse),
      });
    } catch (error) {
      apiErrorHandler(res, error);
    }
  }

  return getAllUserSignups;
}
