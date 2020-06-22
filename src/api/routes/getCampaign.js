const apiErrorHandler = require('../utils/apiErrorHandler');
const transformCampaignResponse = require('../transformers/transformCampaignResponse');
const { STAFF_ROLE } = require('../../shared/roles');

module.exports = ({ db }) => {
  async function getCampaign(req, res) {
    try {
      const {
        campaign,
        token,
      } = req;

      if (token.user.role !== STAFF_ROLE) {
        res.status(401).json({ error: 'Only staff can retrieve the campaign configuration' });
        return;
      }

      res.json({
        campaign: transformCampaignResponse(campaign),
      });
    } catch (error) {
      apiErrorHandler(res, error);
    }
  }

  return getCampaign;
}
