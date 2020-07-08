const fetch = require('node-fetch');
const chai = require('chai');
const { MongoClient } = require('mongodb');

const { API_URL, MONGODB_URL } = process.env;

// Reference: https://www.chaijs.com/api/assert/
const assert = chai.assert;

require('./_setup');

const {
  standardTestSetup,
  fakeUser,
} = require('./_faker');

describe('editUser api route v1', function() {
  it('should edit a user', async function() {
    const standard = await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/user`, {
      method: 'put',
      body: JSON.stringify({
        firstName: 'Test',
        zip: '11111',
        emailFrequency: 'UNSUBSCRIBED',
      }),
      headers: {
        'Content-Type': 'application/json',
        'X-Relational-Token': standard.token,
      },
    });

    assert.equal(response.status, 200);

    const { user } = await response.json();

    assert.isUndefined(user.id);
    assert.equal(user.email, 'ed@edmarkey.com');
    assert.isUndefined(user.password);
    assert.isUndefined(user.lastAuthenticationUpdate);
    assert.equal(user.firstName, 'Test');
    assert.equal(user.zip, '11111');
    assert.equal(user.emailFrequency, 'UNSUBSCRIBED');

    const client = await MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true });
    const users = client.db().collection('users');

    const record = await users.findOne({
      email: 'ed@edmarkey.com',
    });

    assert.equal(record.email, 'ed@edmarkey.com');
    assert.equal(record.firstName, 'Test');
    assert.equal(record.zip, '11111');
    assert.equal(record.emailFrequency, 'UNSUBSCRIBED');
    assert.notEqual(record.lastUpdatedAt, standard.user.lastUpdatedAt);
    assert.equal(record.lastAuthenticationUpdate, standard.user.lastAuthenticationUpdate);
    assert.equal(record.password, standard.user.password);
  });

  it('should edit a user and normalize the email', async function() {
    const standard = await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/user`, {
      method: 'put',
      body: JSON.stringify({
        email: 'TEST@EDMARKEY.COM',
      }),
      headers: {
        'Content-Type': 'application/json',
        'X-Relational-Token': standard.token,
      },
    });

    assert.equal(response.status, 200);

    const client = await MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true });
    const users = client.db().collection('users');

    const record = await users.findOne({
      email: 'test@edmarkey.com',
    });

    assert.isOk(record._id);
  });

  it('should edit a user password and invalidate existing tokens', async function() {
    const standard = await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/user`, {
      method: 'put',
      body: JSON.stringify({
        password: 'password2',
      }),
      headers: {
        'Content-Type': 'application/json',
        'X-Relational-Token': standard.token,
      },
    });

    assert.equal(response.status, 200);

    const { token } = await response.json();

    assert.isString(token);
    assert.lengthOf(token, 128);

    const client = await MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true });
    const users = client.db().collection('users');

    const record = await users.findOne({
      email: 'ed@edmarkey.com',
    });

    assert.notEqual(record.password, standard.user.password);
    assert.notEqual(record.lastAuthenticationUpdate, standard.user.lastAuthenticationUpdate);

    const attempts = await Promise.all([
      await fetch(`${API_URL}/api/v1/user`, {
        method: 'put',
        body: JSON.stringify({
          firstName: 'Test',
        }),
        headers: {
          'Content-Type': 'application/json',
          'X-Relational-Token': standard.token,
        },
      }),
      await fetch(`${API_URL}/api/v1/user`, {
        method: 'put',
        body: JSON.stringify({
          firstName: 'Test',
        }),
        headers: {
          'Content-Type': 'application/json',
          'X-Relational-Token': token,
        },
      }),
    ]);

    assert.equal(attempts[0].status, 401);
    assert.equal(attempts[1].status, 200);
  });

  it('should not edit a user if not authenticated', async function() {
    const standard = await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/user`, {
      method: 'put',
      body: JSON.stringify({
        email: 'test@edmarkey.com',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    assert.equal(response.status, 401);

    const { error } = await response.json();
    assert.isString(error);
  });

  it('should not edit a user email if the email is already in use', async function() {
    const standard = await standardTestSetup();

    await fakeUser({
      email: 'test@edmarkey.com',
      campaign: standard.campaign._id.toString(),
    });

    const response = await fetch(`${API_URL}/api/v1/user`, {
      method: 'put',
      body: JSON.stringify({
        email: 'test@edmarkey.com',
      }),
      headers: {
        'Content-Type': 'application/json',
        'X-Relational-Token': standard.token,
      },
    });

    assert.equal(response.status, 409);

    const { error } = await response.json();
    assert.equal(error, 'validations.existingUser');
  });

  it('should not edit a user if the first name field fails validation', async function() {
    const standard = await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/user`, {
      method: 'put',
      body: JSON.stringify({
        firstName: '',
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

  it('should not edit a user if the email field fails validation', async function() {
    const standard = await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/user`, {
      method: 'put',
      body: JSON.stringify({
        email: '',
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

  it('should not edit a user if the password field fails validation', async function() {
    const standard = await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/user`, {
      method: 'put',
      body: JSON.stringify({
        password: '',
      }),
      headers: {
        'Content-Type': 'application/json',
        'X-Relational-Token': standard.token,
      },
    });

    assert.equal(response.status, 400);

    const { field, error } = await response.json();
    assert.equal(field, 'password');
    assert.equal(error, 'validations.required');
  });

  it('should not edit a user if the zip field fails validation', async function() {
    const standard = await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/user`, {
      method: 'put',
      body: JSON.stringify({
        zip: '',
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

  it('should not edit user if the emailFrequency field fails validation', async function() {
    const standard = await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/user`, {
      method: 'put',
      body: JSON.stringify({
        emailFrequency: '',
      }),
      headers: {
        'Content-Type': 'application/json',
        'X-Relational-Token': standard.token,
      },
    });

    assert.equal(response.status, 400);

    const { field, error } = await response.json();
    assert.equal(field, 'emailFrequency');
    assert.equal(error, 'validations.required');
  });
});
