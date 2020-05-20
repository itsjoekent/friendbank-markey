const ms = require('ms');
const createApiError = require('../utils/createApiError');
const { randomToken } = require('../utils/auth');

module.exports = async function makeToken(db, user, expiresAfter = ms('30 days')) {
  try {
    const tokens = db.collection('tokens');
    const tokenValue = await randomToken();

    if (tokenValue instanceof Error) {
      throw tokenValue;
    }

    await tokens.insertOne({
      _id: tokenValue,
      user: user._id.toString(),
      lauCompare: user.lastAuthenticationUpdate,
      expiresAt: Date.now() + expiresAfter,
    });

    return tokenValue;
  } catch (error) {
    return createApiError(error, 500, 'Error retrieving page from database');
  }
}
