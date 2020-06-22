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

describe('updateCampaign api route v1', function() {
  it('should update the campaign', async function() {
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
      method: 'post',
      body: JSON.stringify({
        note: 'test',
        copy: JSON.stringify({
          test: 1,
        }),
        config: JSON.stringify({
          test: 2,
        }),
      }),
      headers: {
        'Content-Type': 'application/json',
        'X-Relational-Token': staffToken._id.toString(),
      },
    });

    assert.equal(response.status, 200);

    const { campaign } = await response.json();

    assert.isObject(campaign);
    assert.deepEqual(standard.campaign.domains, campaign.domains);
    assert.equal(standard.campaign.name, campaign.name);
    assert.equal(campaign.updateLog[0].updatedBy, staffUser.email);
    assert.equal(campaign.updateLog[0].note, 'test');
    assert.isUndefined(campaign.updateLog[0].snapshot);
    assert.equal(campaign.copy, JSON.stringify({ test: 1 }));
    assert.equal(campaign.config, JSON.stringify({ media: ['default', 'hoops'], test: 2 }));
    assert.isNumber(campaign.lastUpdatedAt);

    const client = await MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true });
    const campaigns = client.db().collection('campaigns');

    const record = await campaigns.findOne({
      _id: standard.campaign._id,
    });

    assert.equal(record.copy, JSON.stringify({ test: 1 }));
    assert.equal(record.config, JSON.stringify({ media: ['default', 'hoops'], test: 2 }));
    assert.isAbove(record.lastUpdatedAt, standard.campaign.lastUpdatedAt);
    assert.lengthOf(record.updateLog, 1);
    assert.equal(record.updateLog[0].snapshot.copy, standard.campaign.copy);
    assert.equal(record.updateLog[0].snapshot.confg, standard.campaign.confg);
  });

  it('should merge campaign update values', async function() {
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

    const client = await MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true });
    const campaigns = client.db().collection('campaigns');

    await campaigns.updateOne({
      _id: standard.campaign._id,
    }, {
      '$set': {
        copy: JSON.stringify({ test: 1, preserve: true }),
      },
    });

    const response = await fetch(`${API_URL}/api/v1/campaign`, {
      method: 'post',
      body: JSON.stringify({
        copy: JSON.stringify({
          test: 2,
        }),
      }),
      headers: {
        'Content-Type': 'application/json',
        'X-Relational-Token': staffToken._id.toString(),
      },
    });

    assert.equal(response.status, 200);

    const { campaign } = await response.json();
    assert.equal(campaign.copy, JSON.stringify({ test: 2, preserve: true }));

    const record = await campaigns.findOne({
      _id: standard.campaign._id,
    });

    assert.equal(campaign.copy, JSON.stringify({ test: 2, preserve: true }));
  });

  it('should not store more than 25 snapshots', async function() {
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

    const client = await MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true });
    const campaigns = client.db().collection('campaigns');

    await campaigns.updateOne({
      _id: standard.campaign._id,
    }, {
      '$set': {
        updateLog: new Array(25).fill({}),
      },
    });

    const response = await fetch(`${API_URL}/api/v1/campaign`, {
      method: 'post',
      body: JSON.stringify({
        copy: JSON.stringify({
          test: 2,
        }),
      }),
      headers: {
        'Content-Type': 'application/json',
        'X-Relational-Token': staffToken._id.toString(),
      },
    });

    assert.equal(response.status, 200);

    const { campaign } = await response.json();
    assert.lengthOf(campaign.updateLog, 25);
  });

  it('should not allow unauthenticated users to update campaigns', async function() {
    const standard = await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/campaign`, {
      method: 'post',
      body: JSON.stringify({
        copy: JSON.stringify({
          test: 2,
        }),
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    assert.equal(response.status, 401);

    const { error } = await response.json();
    assert.isString(error);
  });

  it('should not allow non-staff to update campaigns', async function() {
    const standard = await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/campaign`, {
      method: 'post',
      body: JSON.stringify({
        copy: JSON.stringify({
          test: 2,
        }),
      }),
      headers: {
        'Content-Type': 'application/json',
        'X-Relational-Token': standard.token,
      },
    });

    assert.equal(response.status, 401);

    const { error } = await response.json();
    assert.isString(error);
  });

  it('should not allow staff from other campaigns to update a campaign', async function() {
    const standard = await standardTestSetup();

    const otherCampaign = await fakeCampaign({ domains: ['null'] })

    const staffUser = await fakeUser({
      email: 'admin@edmarkey.com',
      role: STAFF_ROLE,
      campaign: otherCampaign._id.toString(),
    });

    const staffToken = await fakeToken({
      tokenValue: '456',
      user: staffUser._id.toString(),
    });

    const response = await fetch(`${API_URL}/api/v1/campaign`, {
      method: 'post',
      body: JSON.stringify({
        copy: JSON.stringify({
          test: 1,
        }),
        config: JSON.stringify({
          test: 2,
        }),
      }),
      headers: {
        'Content-Type': 'application/json',
        'X-Relational-Token': staffToken._id.toString(),
      },
    });

    assert.equal(response.status, 401);

    const { error } = await response.json();
    assert.isString(error);
  });
});
