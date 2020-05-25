const { ObjectId } = require('mongodb');
const apiErrorHandler = require('../utils/apiErrorHandler');
const transformPageResponse = require('../transformers/transformPageResponse');

module.exports = ({ db }) => {
  async function getUserPages(req, res) {
    try {
      const {
        campaign,
        token,
        query: {
          lastId,
        },
      } = req;

      const pages = db.collection('pages');

      const query = {
        campaign: campaign._id.toString(),
        createdBy: token.user._id.toString(),
      };

      const total = await pages.countDocuments(query);

      if (lastId) {
        query._id = { '$gt': ObjectId(lastId) };
      }

      const result = await pages.find(query, { limit: 25 }).toArray();

      res.json({
        pages: (result || []).map(transformPageResponse),
        lastId: (((result || []).pop() || {})._id || '').toString(),
        total,
      });
    } catch (error) {
      apiErrorHandler(res, error);
    }
  }

  return getUserPages;
}
