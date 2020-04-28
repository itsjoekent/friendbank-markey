module.exports = async function setupDb(db) {
  try {
    const pages = db.collection('pages');

    await pages.createIndex({ code: 1 });

    return true;
  } catch (error) {
    return error;
  }
}
