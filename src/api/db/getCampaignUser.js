module.exports = async function getCampaignUser(db, campaign, email) {
  try {
    const users = db.collection('users');

    const user = await users.findOne({
      email,
      campaign: campaign._id.toString(),
    });

    return user;
  } catch (error) {
    return error;
  }
}
