module.exports = async function getUser(db, email) {
  try {
    const users = db.collection('users');

    const user = await users.findOne({ email });

    return user;
  } catch (error) {
    return error;
  }
}
