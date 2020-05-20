const apiErrorHandler = require('../utils/apiErrorHandler');
const getCampaignForDomain = require('../db/getCampaignForDomain');

module.exports = ({ db }) => {
  async function loadCampaign(req, res, next) {
    try {
      const host = req.get('host');
      const campaign = await getCampaignForDomain(db, host);

      if (campaign instanceof Error) {
        throw campaign;
      }

      if (!campaign) {
        res.status(403).json({ error: 'Not authorized campaign' });
        return;
      }

      req.campaign = campaign;
      next();
    } catch (error) {
      apiErrorHandler(res, error);
    }
  }

  return loadCampaign;
};
