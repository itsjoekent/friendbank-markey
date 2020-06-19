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

      const mediaCollection = db.collection('media');
      let mediaCache = {};

      for (let index = 0; index < result.length; index++) {
        const page = result[index];
        const key = page.background;

        if (!mediaCache[key]) {
          mediaCache[key] = await mediaCollection.findOne({ _id: key });
        }

        result[index].media = mediaCache[key];
      }

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
