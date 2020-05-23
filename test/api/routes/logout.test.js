const fetch = require('node-fetch');
const chai = require('chai');
const { MongoClient } = require('mongodb');

const { API_URL, MONGODB_URL } = process.env;

// Reference: https://www.chaijs.com/api/assert/
const assert = chai.assert;

require('./_setup');

const { standardTestSetup } = require('./_faker');

describe('logout api route v1', function() {
  it('should logout when presented a valid token', async function() {
    const standard = await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/logout`, {
      method: 'post',
      headers: {
        'X-Relational-Token': standard.token,
      },
    });

    assert.equal(response.status, 200);

    const client = await MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true });
    const tokens = client.db().collection('tokens');

    const token = await tokens.findOne({
      _id: standard.token,
    });

    assert.isNull(token);
  });

  it('should return an error if logging out an invalid token', async function() {
    const response = await fetch(`${API_URL}/api/v1/logout`, {
      method: 'post',
      headers: {
        'X-Relational-Token': 'fake',
      },
    });

    assert.equal(response.status, 401);

    const { error } = await response.json();
    assert.isString(error);
  });
});
