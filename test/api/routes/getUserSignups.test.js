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

describe('getUserSignups api route v1', function() {
  it('should get a user signup', async function() {
    const standard = await standardTestSetup();

    const client = await MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true });
    const signupsCollection = client.db().collection('signups');

    const signupInsertResult = await signupsCollection.insertOne({
      code: 'test',
      email: 'supporter@gmail.com',
      firstName: 'First',
      lastName: 'Last',
      phone: '+10000000000',
      zip: '00000',
      supportLevel: 'Definitely',
      volunteerLevel: 'Yes',
      recruitedBy: standard.user._id.toString(),
      type: 'subscriber',
      lastUpdatedAt: Date.now(),
      campaign: standard.campaign._id.toString(),
    });

    const insertedSignup = signupInsertResult.ops[0];

    const response = await fetch(`${API_URL}/api/v1/user/signups`, {
      method: 'get',
      headers: {
        'X-Relational-Token': standard.token,
      },
    });

    assert.equal(response.status, 200);

    const { signups, lastId, total } = await response.json();

    assert.equal(total, 1);
    assert.equal(lastId, insertedSignup._id.toString());
    assert.isArray(signups);
    assert.isObject(signups[0]);
    assert.isUndefined(signups[0]._id);
    assert.equal(signups[0].type, 'subscriber');
    assert.isUndefined(signups[0].campaign);
    assert.equal(signups[0].email, 'supporter@gmail.com');
    assert.equal(signups[0].code, 'test');
    assert.isUndefined(signups[0].recruitedBy);
    assert.equal(signups[0].firstName, 'First');
    assert.equal(signups[0].lastName, 'Last');
    assert.equal(signups[0].phone, '+10000000000');
    assert.equal(signups[0].zip, '00000');
    assert.equal(signups[0].supportLevel, 'Definitely');
    assert.equal(signups[0].volunteerLevel, 'Yes');
  });

  it('should paginate user signups', async function() {
    const standard = await standardTestSetup();

    const client = await MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true });
    const signupsCollection = client.db().collection('signups');

    const insertedSignups = await signupsCollection.insertMany(
      new Array(50).fill({}).reduce((acc, val, index) => ([
        ...acc,
        {
          code: `test-${index}`,
          email: 'supporter@gmail.com',
          firstName: `First ${index}`,
          lastName: 'Last',
          phone: '+10000000000',
          zip: '00000',
          supportLevel: 'Definitely',
          volunteerLevel: 'Yes',
          recruitedBy: standard.user._id.toString(),
          type: 'subscriber',
          lastUpdatedAt: Date.now(),
          campaign: standard.campaign._id.toString(),
        },
      ]), [])
    );

    const initialResponse = await fetch(`${API_URL}/api/v1/user/signups`, {
      method: 'get',
      headers: {
        'X-Relational-Token': standard.token,
      },
    });

    assert.equal(initialResponse.status, 200);

    const initialJson = await initialResponse.json();

    assert.lengthOf(initialJson.signups, 25);
    assert.equal(initialJson.total, 50);
    assert.equal(initialJson.lastId, insertedSignups.ops[24]._id.toString());
    assert.equal(initialJson.signups[0].code, 'test-0');
    assert.equal(initialJson.signups[0].firstName, 'First 0');
    assert.equal(initialJson.signups[24].code, 'test-24');
    assert.equal(initialJson.signups[24].firstName, 'First 24');

    const paginatedResponse = await fetch(`${API_URL}/api/v1/user/signups?lastId=${initialJson.lastId}`, {
      method: 'get',
      headers: {
        'X-Relational-Token': standard.token,
      },
    });

    assert.equal(paginatedResponse.status, 200);

    const paginatedJson = await paginatedResponse.json();

    assert.lengthOf(paginatedJson.signups, 25);
    assert.equal(paginatedJson.total, 50);
    assert.equal(paginatedJson.lastId, insertedSignups.ops[49]._id.toString());
    assert.equal(paginatedJson.signups[0].code, 'test-25');
    assert.equal(paginatedJson.signups[0].firstName, 'First 25');
    assert.equal(paginatedJson.signups[24].code, 'test-49');
    assert.equal(paginatedJson.signups[24].firstName, 'First 49');
  });

  it('should not get user signups if not authenticated', async function() {
    const standard = await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/user/signups`, {
      method: 'get',
    });

    assert.equal(response.status, 401);

    const { error } = await response.json();
    assert.isString(error);
  });

  it ('should return an error if domain is not configured', async function() {
    const campaign = await fakeCampaign({ domains: [] });
    const user = await fakeUser({ campaign: campaign._id.toString() });
    const token = await fakeToken({ user: user._id.toString() });

    const response = await fetch(`${API_URL}/api/v1/user/signups`, {
      method: 'get',
      headers: {
        'X-Relational-Token': token._id.toString(),
      },
    });

    assert.equal(response.status, 403);

    const { error } = await response.json();
    assert.isString(error);
  });
});
