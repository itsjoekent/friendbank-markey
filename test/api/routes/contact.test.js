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

describe('contact api route v1', function() {
  it('should create a contact', async function() {
    const standard = await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/contact`, {
      method: 'post',
      body: JSON.stringify({
        email: 'supporter@gmail.com',
        firstName: 'First',
        lastName: 'Last',
        phone: '000 000 0000',
        zip: '00000',
        supportLevel: 'Definitely',
        volunteerLevel: 'Yes',
      }),
      headers: {
        'Content-Type': 'application/json',
        'X-Relational-Token': standard.token,
      },
    });

    assert.equal(response.status, 200);

    const client = await MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true });
    const signups = client.db().collection('signups');

    const record = await signups.findOne({
      campaign: standard.campaign._id.toString(),
      email: 'supporter@gmail.com',
      recruitedBy: standard.user._id.toString(),
    });

    assert.isObject(record);
    assert.equal(record.type, 'contact');
    assert.equal(record.campaign, standard.campaign._id.toString());
    assert.equal(record.email, 'supporter@gmail.com');
    assert.isUndefined(record.code);
    assert.equal(record.recruitedBy, standard.user._id.toString());
    assert.equal(record.firstName, 'First');
    assert.equal(record.lastName, 'Last');
    assert.equal(record.phone, '+10000000000');
    assert.equal(record.zip, '00000');
    assert.equal(record.supportLevel, 'Definitely');
    assert.equal(record.volunteerLevel, 'Yes');
  });

  it('should update an existing contact', async function() {
    const standard = await standardTestSetup();

    const client = await MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true });
    const signups = client.db().collection('signups');

    const insertedAt = Date.now();
    await signups.insertOne({
      campaign: standard.campaign._id.toString(),
      email: 'supporter@gmail.com',
      recruitedBy: standard.user._id.toString(),
      firstName: 'one',
      lastUpdatedAt: insertedAt,
    });

    const response = await fetch(`${API_URL}/api/v1/contact`, {
      method: 'post',
      body: JSON.stringify({
        email: 'supporter@gmail.com',
        firstName: 'two',
      }),
      headers: {
        'Content-Type': 'application/json',
        'X-Relational-Token': standard.token,
      },
    });

    assert.equal(response.status, 200);

    const record = await signups.findOne({
      campaign: standard.campaign._id.toString(),
      email: 'supporter@gmail.com',
      recruitedBy: standard.user._id.toString(),
    });

    assert.equal(record.firstName, 'two');
    assert.isAbove(record.lastUpdatedAt, insertedAt);
  });

  it('should make multiple contacts for different recruiters', async function() {
    const standard = await standardTestSetup();

    const client = await MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true });
    const signups = client.db().collection('signups');

    const recruiters = await Promise.all([
      await fakeUser({ email: 'first@edmarkey.com' }),
      await fakeUser({ email: 'second@edmarkey.com' }),
    ]);

    const recruiterTokens = await Promise.all([
      await fakeToken({ tokenValue: '1', user: recruiters[0]._id.toString() }),
      await fakeToken({ tokenValue: '2', user: recruiters[1]._id.toString() }),
    ]);

    const responses = await Promise.all([
      await fetch(`${API_URL}/api/v1/contact`, {
        method: 'post',
        body: JSON.stringify({
          code: 'test1',
          email: 'supporter@gmail.com',
          firstName: 'one',
        }),
        headers: {
          'Content-Type': 'application/json',
          'X-Relational-Token': recruiterTokens[0]._id.toString(),
        },
      }),
      await fetch(`${API_URL}/api/v1/contact`, {
        method: 'post',
        body: JSON.stringify({
          code: 'test2',
          email: 'supporter@gmail.com',
          firstName: 'two',
        }),
        headers: {
          'Content-Type': 'application/json',
          'X-Relational-Token': recruiterTokens[1]._id.toString(),
        },
      }),
    ]);

    assert.equal(responses[0].status, 200);
    assert.equal(responses[1].status, 200);

    const records = await Promise.all([
      await signups.findOne({
        campaign: standard.campaign._id.toString(),
        email: 'supporter@gmail.com',
        recruitedBy: recruiters[0]._id.toString(),
      }),
      await signups.findOne({
        campaign: standard.campaign._id.toString(),
        email: 'supporter@gmail.com',
        recruitedBy: recruiters[1]._id.toString(),
      }),
    ]);

    assert.equal(records[0].firstName, 'one');
    assert.equal(records[1].firstName, 'two');
  });

  it('should not create a contact if the email field is missing', async function() {
    const standard = await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/contact`, {
      method: 'post',
      body: JSON.stringify({
        firstName: 'First',
        lastName: 'Last',
      }),
      headers: {
        'Content-Type': 'application/json',
        'X-Relational-Token': standard.token,
      },
    });

    assert.equal(response.status, 400);

    const { field, error } = await response.json();
    assert.equal(field, 'email');
    assert.equal(error, 'validations.required');
  });

  it('should not create a contact if the firstName field fails validation', async function() {
    const standard = await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/contact`, {
      method: 'post',
      body: JSON.stringify({
        email: 'supporter@gmail.com',
        firstName: null,
      }),
      headers: {
        'Content-Type': 'application/json',
        'X-Relational-Token': standard.token,
      },
    });

    assert.equal(response.status, 400);

    const { field, error } = await response.json();
    assert.equal(field, 'firstName');
    assert.equal(error, 'validations.required');
  });

  it('should not create a contact if the lastName field fails validation', async function() {
    const standard = await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/contact`, {
      method: 'post',
      body: JSON.stringify({
        email: 'supporter@gmail.com',
        lastName: null,
      }),
      headers: {
        'Content-Type': 'application/json',
        'X-Relational-Token': standard.token,
      },
    });

    assert.equal(response.status, 400);

    const { field, error } = await response.json();
    assert.equal(field, 'lastName');
    assert.equal(error, 'validations.required');
  });

  it('should not create a contact if the phone field fails validation', async function() {
    const standard = await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/contact`, {
      method: 'post',
      body: JSON.stringify({
        email: 'supporter@gmail.com',
        phone: null,
      }),
      headers: {
        'Content-Type': 'application/json',
        'X-Relational-Token': standard.token,
      },
    });

    assert.equal(response.status, 400);

    const { field, error } = await response.json();
    assert.equal(field, 'phone');
    assert.equal(error, 'validations.required');
  });

  it('should not create a contact if the zip field fails validation', async function() {
    const standard = await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/contact`, {
      method: 'post',
      body: JSON.stringify({
        email: 'supporter@gmail.com',
        zip: null,
      }),
      headers: {
        'Content-Type': 'application/json',
        'X-Relational-Token': standard.token,
      },
    });

    assert.equal(response.status, 400);

    const { field, error } = await response.json();
    assert.equal(field, 'zip');
    assert.equal(error, 'validations.required');
  });

  it('should not create a contact if the supportLevel field fails validation', async function() {
    const standard = await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/contact`, {
      method: 'post',
      body: JSON.stringify({
        email: 'supporter@gmail.com',
        supportLevel: null,
      }),
      headers: {
        'Content-Type': 'application/json',
        'X-Relational-Token': standard.token,
      },
    });

    assert.equal(response.status, 400);

    const { field, error } = await response.json();
    assert.equal(field, 'supportLevel');
    assert.equal(error, 'validations.required');
  });

  it('should not create a contact if the volunteerLevel field fails validation', async function() {
    const standard = await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/contact`, {
      method: 'post',
      body: JSON.stringify({
        email: 'supporter@gmail.com',
        volunteerLevel: null,
      }),
      headers: {
        'Content-Type': 'application/json',
        'X-Relational-Token': standard.token,
      },
    });

    assert.equal(response.status, 400);

    const { field, error } = await response.json();
    assert.equal(field, 'volunteerLevel');
    assert.equal(error, 'validations.required');
  });

  it ('should return an error if not authenticated', async function() {
    const standard = await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/contact`, {
      method: 'post',
      body: JSON.stringify({
        email: 'supporter@gmail.com',
        firstName: 'First',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    assert.equal(response.status, 401);

    const { error } = await response.json();
    assert.isString(error);
  });

  it ('should return an error if domain is not configured', async function() {
    const campaign = await fakeCampaign({ domains: [] });
    const user = await fakeUser({ campaign: campaign._id.toString() });
    const token = await fakeToken({ user: user._id.toString() });

    const response = await fetch(`${API_URL}/api/v1/contact`, {
      method: 'post',
      body: JSON.stringify({
        email: 'supporter@gmail.com',
      }),
      headers: {
        'Content-Type': 'application/json',
        'X-Relational-Token': token._id.toString(),
      },
    });

    assert.equal(response.status, 403);

    const { error } = await response.json();
    assert.isString(error);
  });
});
