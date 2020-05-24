const fetch = require('node-fetch');
const chai = require('chai');
const { MongoClient } = require('mongodb');

const { API_URL, MONGODB_URL } = process.env;

// Reference: https://www.chaijs.com/api/assert/
const assert = chai.assert;

require('./_setup');

const { standardTestSetup } = require('./_faker');

describe('login api route v1', function() {
  it('should login and provide an authentication token', async function() {
    const standard = await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/login`, {
      method: 'post',
      body: JSON.stringify({
        email: 'ed@edmarkey.com',
        password: 'password',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    assert.equal(response.status, 200);

    const { token } = await response.json();

    assert.isString(token);
    assert.lengthOf(token, 128);

    const client = await MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true });
    const tokens = client.db().collection('tokens');

    const dbToken = await tokens.findOne({ _id: token });
    assert.equal(dbToken.user, standard.user._id.toString());
  });

  it('should login regardless of email capitalization', async function() {
    const standard = await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/login`, {
      method: 'post',
      body: JSON.stringify({
        email: 'ED@EDMARKEY.COM',
        password: 'password',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    assert.equal(response.status, 200);
  });

  it('should not login if the email is incorrect', async function() {
    await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/login`, {
      method: 'post',
      body: JSON.stringify({
        email: 'fake@gmail.com',
        password: 'password',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    assert.equal(response.status, 401);

    const { error } = await response.json();
    assert.equal(error, 'validations.failedLogin');
  });

  it('should not login if the password is incorrect', async function() {
    await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/login`, {
      method: 'post',
      body: JSON.stringify({
        email: 'ed@edmarkey.com',
        password: 'incorrect-password',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    assert.equal(response.status, 401);

    const { error } = await response.json();
    assert.equal(error, 'validations.failedLogin');
  });

  it('should not login if the email field fails validation', async function() {
    await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/login`, {
      method: 'post',
      body: JSON.stringify({
        password: 'incorrect-password',
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

  it('should not login if the password field fails validation', async function() {
    await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/login`, {
      method: 'post',
      body: JSON.stringify({
        email: 'ed@edmarkey.com',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    assert.equal(response.status, 400);

    const { field, error } = await response.json();
    assert.equal(field, 'password');
    assert.equal(error, 'validations.required');
  });
});
