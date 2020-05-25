module.exports = async function setupDb(db) {
  try {
    const campaigns = db.collection('campaigns');
    await campaigns.createIndex({ domains: 1 });

    const pages = db.collection('pages');
    await pages.createIndex({ code: 1 });
    await pages.createIndex({ campaign: 1 });
    await pages.createIndex({ createdBy: 1 });

    const signups = db.collection('signups');
    await signups.createIndex({ email: 1 });
    await signups.createIndex({ recruitedBy: 1 });
    await signups.createIndex({ campaign: 1 });

    const users = db.collection('users');
    await users.createIndex({ email: 1 });

    return true;
  } catch (error) {
    return error;
  }
}
