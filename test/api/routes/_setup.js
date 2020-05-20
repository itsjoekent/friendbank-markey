const fetch = require('node-fetch');
const { MongoClient } = require('mongodb');

const setupDb = require('../../../src/api/db/setup');

const { API_URL, MONGODB_URL } = process.env;

async function sleep(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

before('wait for host to be reachable', async function() {
  this.timeout(10000);

  async function check() {
    try {
      const response = await fetch(`${API_URL}/api/v1/health`);

      if (response.status === 200) {
        return true;
      }
    } catch (error) {}

    await sleep(100);

    return check();
  }

  await check();
});

beforeEach('clear database', async function() {
  const client = await MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true });
  const db = client.db();

  await db.dropDatabase();
  await setupDb(db);

  client.close();
});
