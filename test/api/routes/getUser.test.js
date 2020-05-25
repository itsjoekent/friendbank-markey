const fetch = require('node-fetch');
const chai = require('chai');
const { MongoClient } = require('mongodb');

const { API_URL, MONGODB_URL } = process.env;

// Reference: https://www.chaijs.com/api/assert/
const assert = chai.assert;

require('./_setup');
const {
  standardTestSetup,
  fakeCampaign,
  fakeUser,
  fakeToken,
} = require('./_faker');

describe('getUser api route v1', function() {
  it('should get a user', async function() {
    const standard = await standardTestSetup();

    const client = await MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true });

    const response = await fetch(`${API_URL}/api/v1/user`, {
      method: 'get',
      headers: {
        'X-Relational-Token': standard.token,
      },
    });

    assert.equal(response.status, 200);

    const { user } = await response.json();

    assert.isObject(user);
    assert.isUndefined(user._id);
    assert.isUndefined(user.createdAt);
    assert.isUndefined(user.lastUpdatedAt);
    assert.isUndefined(user.password);
    assert.isUndefined(user.lastAuthenticationUpdate);
    assert.equal(user.email, standard.user.email);
    assert.equal(user.firstName, standard.user.firstName);
    assert.equal(user.zip, standard.user.zip);
    assert.equal(user.emailFrequency, standard.user.emailFrequency);
  });

  it('should not get a user if not authenticated', async function() {
    const standard = await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/user`, {
      method: 'get',
    });

    assert.equal(response.status, 401);

    const { error } = await response.json();
    assert.isString(error);
  });
});
