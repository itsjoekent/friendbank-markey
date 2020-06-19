const { STAFF_ROLE } = require('../../shared/roles');

module.exports = async function validateBackgroundField(db, token, campaign, background) {
  try {
    if (token.user.role === STAFF_ROLE) {
      const mediaCollection = db.collection('media');
      const mediaMatch = await mediaCollection.findOne({ _id: background });

      if (!mediaMatch) {
        return { field: 'background', error: 'validations.required' };
      }
    } else {
      const config = JSON.parse(campaign.config);

      if (!config.media.includes(background)) {
        return { field: 'background', error: 'validations.required' };
      }
    }

    return null;
  } catch (error) {
    return error;
  }
}
