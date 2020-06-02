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
} = require('./_faker');

const _readServiceOutput = require('../__services/_readServiceOutput');

describe('signup api route v1', function() {
  it('should create a signup not associated with a page', async function() {
    const standard = await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/signup`, {
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
      },
    });

    assert.equal(response.status, 200);

    const client = await MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true });
    const signups = client.db().collection('signups');

    const record = await signups.findOne({
      campaign: standard.campaign._id.toString(),
      email: 'supporter@gmail.com',
    });

    assert.isObject(record);
    assert.equal(record.type, 'subscriber');
    assert.equal(record.campaign, standard.campaign._id.toString());
    assert.equal(record.email, 'supporter@gmail.com');
    assert.isUndefined(record.code);
    assert.isNull(record.recruitedBy);
    assert.equal(record.firstName, 'First');
    assert.equal(record.lastName, 'Last');
    assert.equal(record.phone, '+10000000000');
    assert.equal(record.zip, '00000');
    assert.equal(record.supportLevel, 'Definitely');
    assert.equal(record.volunteerLevel, 'Yes');
  });

  it('should create a signup associated with a page', async function() {
    const standard = await standardTestSetup();

    const client = await MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true });
    const pages = client.db().collection('pages');
    const signups = client.db().collection('signups');

    await pages.insertOne({
      code: 'test',
      campaign: standard.campaign._id.toString(),
      createdBy: standard.user._id.toString(),
    });

    const response = await fetch(`${API_URL}/api/v1/signup`, {
      method: 'post',
      body: JSON.stringify({
        code: 'test',
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
      },
    });

    assert.equal(response.status, 200);

    const record = await signups.findOne({
      campaign: standard.campaign._id.toString(),
      email: 'supporter@gmail.com',
      recruitedBy: standard.user._id.toString(),
    });

    assert.isObject(record);
    assert.equal(record.campaign, standard.campaign._id.toString());
    assert.equal(record.email, 'supporter@gmail.com');
    assert.equal(record.code, 'test');
    assert.equal(record.recruitedBy, standard.user._id.toString());
    assert.equal(record.firstName, 'First');
    assert.equal(record.lastName, 'Last');
    assert.equal(record.phone, '+10000000000');
    assert.equal(record.zip, '00000');
    assert.equal(record.supportLevel, 'Definitely');
    assert.equal(record.volunteerLevel, 'Yes');

    const message = await _readServiceOutput('mail');
    assert.doesNotHaveAnyKeys(message);
  });

  it('should update an existing signup associated with a page', async function() {
    const standard = await standardTestSetup();

    const client = await MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true });
    const pages = client.db().collection('pages');
    const signups = client.db().collection('signups');

    await pages.insertOne({
      code: 'test',
      campaign: standard.campaign._id.toString(),
      createdBy: standard.user._id.toString(),
    });

    const insertedAt = Date.now();
    await signups.insertOne({
      campaign: standard.campaign._id.toString(),
      email: 'supporter@gmail.com',
      recruitedBy: standard.user._id.toString(),
      firstName: 'one',
      lastUpdatedAt: insertedAt,
    });

    const response = await fetch(`${API_URL}/api/v1/signup`, {
      method: 'post',
      body: JSON.stringify({
        code: 'test',
        email: 'supporter@gmail.com',
        firstName: 'two',
      }),
      headers: {
        'Content-Type': 'application/json',
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

  it('should make multiple signups for different pages on the same campaign', async function() {
    const standard = await standardTestSetup();

    const client = await MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true });
    const pages = client.db().collection('pages');
    const signups = client.db().collection('signups');

    const recruiters = await Promise.all([
      await fakeUser({ email: 'first@edmarkey.com' }),
      await fakeUser({ email: 'second@edmarkey.com' }),
    ]);

    await pages.insertMany([
      {
        code: 'test1',
        campaign: standard.campaign._id.toString(),
        createdBy: recruiters[0]._id.toString(),
      },
      {
        code: 'test2',
        campaign: standard.campaign._id.toString(),
        createdBy: recruiters[1]._id.toString(),
      },
    ]);

    const responses = await Promise.all([
      await fetch(`${API_URL}/api/v1/signup`, {
        method: 'post',
        body: JSON.stringify({
          code: 'test1',
          email: 'supporter@gmail.com',
          firstName: 'one',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      await fetch(`${API_URL}/api/v1/signup`, {
        method: 'post',
        body: JSON.stringify({
          code: 'test2',
          email: 'supporter@gmail.com',
          firstName: 'two',
        }),
        headers: {
          'Content-Type': 'application/json',
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

  it('should create a signup associated with a page that triggers an email', async function() {
    const standard = await standardTestSetup();

    const author = await fakeUser({
      campaign: standard.campaign._id.toString(),
      email: 'emma@edmarkey.com',
      password: 'password',
      firstName: 'Emma',
      zip: '00000',
      emailFrequency: 'TRANSACTIONAL_EMAIL',
    });

    const client = await MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true });
    const pages = client.db().collection('pages');
    const signups = client.db().collection('signups');
    const campaigns = client.db().collection('campaigns');

    await campaigns.updateOne(
      { _id: standard.campaign._id },
      { '$set': { domains: ['api:5000', 'support.edmarkey.com'] } },
    );

    await pages.insertOne({
      code: 'test',
      createdBy: author._id.toString(),
      campaign: standard.campaign._id.toString(),
    });

    const response = await fetch(`${API_URL}/api/v1/signup`, {
      method: 'post',
      body: JSON.stringify({
        code: 'test',
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
      },
    });

    assert.equal(response.status, 200);

    const message = await _readServiceOutput('mail');
    assert.equal(message.to, author.email);
    assert.equal(message.dynamic_template_data.signupFirstName, 'First');
    assert.equal(message.dynamic_template_data.signupLastName, 'Last');
    assert.equal(message.dynamic_template_data.campaignName, standard.campaign.name);
    assert.equal(message.dynamic_template_data.domain, 'support.edmarkey.com');
  });

  it('should create a signup without all fields', async function() {
    const standard = await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/signup`, {
      method: 'post',
      body: JSON.stringify({
        email: 'supporter@gmail.com',
        firstName: 'First',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    assert.equal(response.status, 200);

    const client = await MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true });
    const signups = client.db().collection('signups');

    const record = await signups.findOne({
      campaign: standard.campaign._id.toString(),
      email: 'supporter@gmail.com',
    });

    assert.isObject(record);
    assert.equal(record.campaign, standard.campaign._id.toString());
    assert.equal(record.email, 'supporter@gmail.com');
    assert.equal(record.firstName, 'First');
  });

  it('should update a signup with new fields and preserve existing', async function() {
    const standard = await standardTestSetup();

    const client = await MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true });
    const signups = client.db().collection('signups');

    await signups.insertOne({
      email: 'supporter@gmail.com',
      campaign: standard.campaign._id.toString(),
      firstName: 'First',
    });

    const response = await fetch(`${API_URL}/api/v1/signup`, {
      method: 'post',
      body: JSON.stringify({
        email: 'supporter@gmail.com',
        lastName: 'Last',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    assert.equal(response.status, 200);

    const record = await signups.findOne({
      campaign: standard.campaign._id.toString(),
      email: 'supporter@gmail.com',
    });

    assert.isObject(record);
    assert.equal(record.campaign, standard.campaign._id.toString());
    assert.equal(record.email, 'supporter@gmail.com');
    assert.equal(record.firstName, 'First');
    assert.equal(record.lastName, 'Last');
  });

  it('should create a signup and send the data to bsd', async function() {
    const standard = await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/signup`, {
      method: 'post',
      body: JSON.stringify({
        email: 'supporter@gmail.com',
        firstName: 'First',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    assert.equal(response.status, 200);

    const payload = await _readServiceOutput('bsd');
    assert.include(payload.url, process.env.BSD_SIGNUP_FORM_SLUG);
    assert.include(payload.body, 'email=supporter%40gmail.com');
    assert.include(payload.body, 'firstname=First');
  });

  it('should not create a signup if the code does not match a real page', async function() {
    const standard = await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/signup`, {
      method: 'post',
      body: JSON.stringify({
        code: 'test',
        email: 'supporter@gmail.com',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    assert.equal(response.status, 400);

    const { error } = await response.json();
    assert.isString(error);
  });

  it('should not create a signup if the email field is missing', async function() {
    const standard = await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/signup`, {
      method: 'post',
      body: JSON.stringify({
        firstName: 'First',
        lastName: 'Last',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    assert.equal(response.status, 400);

    const { field, error } = await response.json();
    assert.equal(field, 'email');
    assert.equal(error, 'validations.required');
  });

  it('should not create a signup if the firstName field fails validation', async function() {
    const standard = await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/signup`, {
      method: 'post',
      body: JSON.stringify({
        email: 'supporter@gmail.com',
        firstName: null,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    assert.equal(response.status, 400);

    const { field, error } = await response.json();
    assert.equal(field, 'firstName');
    assert.equal(error, 'validations.required');
  });

  it('should not create a signup if the lastName field fails validation', async function() {
    const standard = await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/signup`, {
      method: 'post',
      body: JSON.stringify({
        email: 'supporter@gmail.com',
        lastName: null,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    assert.equal(response.status, 400);

    const { field, error } = await response.json();
    assert.equal(field, 'lastName');
    assert.equal(error, 'validations.required');
  });

  it('should not create a signup if the phone field fails validation', async function() {
    const standard = await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/signup`, {
      method: 'post',
      body: JSON.stringify({
        email: 'supporter@gmail.com',
        phone: null,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    assert.equal(response.status, 400);

    const { field, error } = await response.json();
    assert.equal(field, 'phone');
    assert.equal(error, 'validations.required');
  });

  it('should not create a signup if the zip field fails validation', async function() {
    const standard = await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/signup`, {
      method: 'post',
      body: JSON.stringify({
        email: 'supporter@gmail.com',
        zip: null,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    assert.equal(response.status, 400);

    const { field, error } = await response.json();
    assert.equal(field, 'zip');
    assert.equal(error, 'validations.required');
  });

  it('should not create a signup if the supportLevel field fails validation', async function() {
    const standard = await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/signup`, {
      method: 'post',
      body: JSON.stringify({
        email: 'supporter@gmail.com',
        supportLevel: null,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    assert.equal(response.status, 400);

    const { field, error } = await response.json();
    assert.equal(field, 'supportLevel');
    assert.equal(error, 'validations.required');
  });

  it('should not create a signup if the volunteerLevel field fails validation', async function() {
    const standard = await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/signup`, {
      method: 'post',
      body: JSON.stringify({
        email: 'supporter@gmail.com',
        volunteerLevel: null,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    assert.equal(response.status, 400);

    const { field, error } = await response.json();
    assert.equal(field, 'volunteerLevel');
    assert.equal(error, 'validations.required');
  });

  it ('should return an error if domain is not configured', async function() {
    const campaign = await fakeCampaign({ domains: [] });

    const response = await fetch(`${API_URL}/api/v1/signup`, {
      method: 'post',
      body: JSON.stringify({
        email: 'supporter@gmail.com',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    assert.equal(response.status, 403);

    const { error } = await response.json();
    assert.isString(error);
  });
});
