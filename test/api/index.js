const fetch = require('node-fetch');
const chai = require('chai');

const MongoClient = require('mongodb').MongoClient;

const { API_URL, MONGODB_URL } = process.env;

// Reference: https://www.chaijs.com/api/assert/
const assert = chai.assert;

beforeEach('clear database', function(done) {
  MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true }, (error, client) => {
    if (error !== null) {
      console.log('Failed to connect to MongoDB');
      console.error(error);
      process.exit(1);
    }

    const db = client.db('markey');

    db.dropDatabase(() => {
      client.close();
      done();
    });
  });
});

describe('page api v1', function() {
  it ('should return a 404 for a non existent page', async function() {
    const response = await fetch(`${API_URL}/api/v1/page/test`);
    assert.equal(response.status, 404);
  });
});
