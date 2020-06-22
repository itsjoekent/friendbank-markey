const fetch = require('node-fetch');
const chai = require('chai');
const { MongoClient } = require('mongodb');

const { API_URL, MONGODB_URL } = process.env;

const { STAFF_ROLE } = require('../../../src/shared/roles');

// Reference: https://www.chaijs.com/api/assert/
const assert = chai.assert;

require('./_setup');

const {
  standardTestSetup,
  fakeCampaign,
  fakeUser,
  fakeToken,
} = require('./_faker');

describe('getCampaign api route v1', function() {
  it('should get the campaign', async function() {
    const standard = await standardTestSetup();

    const staffUser = await fakeUser({
      email: 'admin@edmarkey.com',
      role: STAFF_ROLE,
      campaign: standard.campaign._id.toString(),
    });

    const staffToken = await fakeToken({
      tokenValue: '456',
      user: staffUser._id.toString(),
    });

    const response = await fetch(`${API_URL}/api/v1/campaign`, {
      method: 'get',
      headers: {
        'X-Relational-Token': staffToken._id.toString(),
      },
    });

    assert.equal(response.status, 200);

    const { campaign } = await response.json();

    assert.isObject(campaign);
    assert.deepEqual(standard.campaign.domains, campaign.domains);
    assert.equal(standard.campaign.name, campaign.name);
    assert.deepEqual(standard.campaign.updateLog, campaign.updateLog);
    assert.equal(standard.campaign.copy, campaign.copy);
    assert.equal(standard.campaign.config, campaign.config);
    assert.equal(standard.campaign.lastUpdatedAt, campaign.lastUpdatedAt);
  });

  it('should not get the campaign if unauthenticated', async function() {
    const standard = await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/campaign`, {
      method: 'get',
    });

    assert.equal(response.status, 401);

    const { error } = await response.json();
    assert.isString(error);
  });

  it('should not get the campaign if not staff', async function() {
    const standard = await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/campaign`, {
      method: 'get',
      headers: {
        'X-Relational-Token': standard.token,
      },
    });

    assert.equal(response.status, 401);

    const { error } = await response.json();
    assert.isString(error);
  });
});
