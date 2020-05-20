const createApiError = require('../utils/createApiError');

module.exports = async function getPageForCode(db, campaign, code) {
  try {
    const pages = db.collection('pages');

    const page = await pages.findOne({ code, campaign });

    return page;
  } catch (error) {
    return createApiError(error, 500, 'Error retrieving page from database');
  }
}
