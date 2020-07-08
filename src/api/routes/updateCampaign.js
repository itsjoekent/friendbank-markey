const apiErrorHandler = require('../utils/apiErrorHandler');
const transformCampaignResponse = require('../transformers/transformCampaignResponse');
const { STAFF_ROLE } = require('../../shared/roles');

module.exports = ({ db }) => {
  async function updateCampaign(req, res) {
    try {
      const {
        campaign,
        token,
        body: {
          copy,
          config,
          note,
        },
      } = req;

      if (token.user.role !== STAFF_ROLE) {
        res.status(401).json({ error: 'Only staff can update the campaign' });
        return;
      }

      if (token.user.campaign !== campaign._id.toString()) {
        res.status(401).json({ error: 'Only staff can update the campaign' });
        return;
      }

      let upsertCopy = campaign.copy;
      let upsertConfig = campaign.config;

      if (typeof copy === 'string') {
        upsertCopy = JSON.stringify({
          ...JSON.parse(campaign.copy),
          ...JSON.parse(copy),
        });
      }

      if (typeof config === 'string') {
        upsertConfig = JSON.stringify({
          ...JSON.parse(campaign.config),
          ...JSON.parse(config),
        });
      }

      const updateLog = [
        {
          updatedAt: Date.now(),
          updatedBy: token.user.email,
          note,
          snapshot: {
            copy: campaign.copy,
            config: campaign.config,
          },
        },
        ...(campaign.updateLog || []),
      ].slice(0, 25);

      const campaigns = db.collection('campaigns');

      const { value: updatedCampaign } = await campaigns.findOneAndUpdate(
        { _id: campaign._id },
        {
          '$set': {
            copy: upsertCopy,
            config: upsertConfig,
            updateLog,
            lastUpdatedAt: Date.now(),
          },
        },
        {
          returnOriginal: false,
        },
      );

      res.json({
        campaign: transformCampaignResponse(updatedCampaign),
      });
    } catch (error) {
      apiErrorHandler(res, error);
    }
  }

  return updateCampaign;
}
