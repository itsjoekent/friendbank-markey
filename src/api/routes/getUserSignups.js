const { ObjectId } = require('mongodb');
const apiErrorHandler = require('../utils/apiErrorHandler');
const transformSignupResponse = require('../transformers/transformSignupResponse');

module.exports = ({ db }) => {
  async function getUserSignups(req, res) {
    try {
      const {
        campaign,
        token,
        query: {
          lastId,
          firstId,
        },
      } = req;

      const signups = db.collection('signups');

      const query = {
        campaign: campaign._id.toString(),
        recruitedBy: token.user._id.toString(),
      };

      const total = await signups.countDocuments(query);

      if (lastId) {
        query._id = { '$lt': ObjectId(lastId) };
      }

      let result = await signups
        .find(query, { limit: 10 })
        .sort({ _id: -1 })
        .toArray();

      res.json({
        signups: (result || []).map(transformSignupResponse),
        lastId: (((result || []).pop() || {})._id || '').toString(),
        total,
      });
    } catch (error) {
      apiErrorHandler(res, error);
    }
  }

  return getUserSignups;
}
