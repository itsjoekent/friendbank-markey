const ms = require('ms');
const makeToken = require('../db/makeToken');
const getCampaignUser = require('../db/getCampaignUser');
const apiErrorHandler = require('../utils/apiErrorHandler');

module.exports = ({ db }) => {
  async function forgotPassword(req, res) {
    try {
      const {
        campaign,
        body: {
          email,
        },
      } = req;

      const user = await getCampaignUser(db, campaign, email);

      if (user instanceof Error) {
        throw user;
      }

      if (user) {
        const resetToken = await makeToken(db, user, ms('1 hour'));
        // send mail
      }

      res.json({ ok: true });
    } catch (error) {
      apiErrorHandler(res, error);
    }
  }

  return forgotPassword;
};
