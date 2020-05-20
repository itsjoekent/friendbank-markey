const { ObjectId } = require('mongodb');
const createApiError = require('../utils/createApiError');

module.exports = async function getToken(db, token) {
  try {
    const tokens = db.collection('tokens');
    const users = db.collection('users');

    const match = await tokens.findOne({ _id: token });

    if (!match || match.expiresAt < Date.now()) {
      return null;
    }

    const user = await db.collection('users').findOne({
      _id: ObjectId(match.user),
    });

    if (!user) {
      return null;
    }

    return { ...match, user };
  } catch (error) {
    return createApiError(error, 500, 'Error retrieving token from database');
  }
}
