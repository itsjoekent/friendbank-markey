const getPageForCode = require('../db/getPageForCode');
const apiErrorHandler = require('../utils/apiErrorHandler');
const transformPageResponse = require('../transformers/transformPageResponse');
const normalizePageCode = require('../../shared/normalizePageCode');

module.exports = ({ db }) => {
  async function getPage(req, res) {
    try {
      const {
        campaign,
        params: {
          code,
        },
      } = req;

      const page = await getPageForCode(
        db,
        campaign._id.toString(),
        normalizePageCode(code),
      );

      if (page instanceof Error) {
        throw page;
      }

      if (!page) {
        res.status(404).json({ error: 'Page not found' });
        return;
      }

      res.json({ page: transformPageResponse(page) });
    } catch (error) {
      apiErrorHandler(res, error);
    }
  }

  return getPage;
}
