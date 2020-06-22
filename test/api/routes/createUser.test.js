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

describe('createUser api route v1', function() {
  it('should create a new user', async function() {
    const standard = await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/user`, {
      method: 'post',
      body: JSON.stringify({
        email: 'test@edmarkey.com',
        password: 'password',
        firstName: 'Test',
        zip: '00000',
        emailFrequency: 'WEEKLY_EMAIL',
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
    const users = client.db().collection('users');

    const record = await users.findOne({
      email: 'test@edmarkey.com',
    });

    assert.equal(record.firstName, 'Test');
    assert.equal(record.zip, '00000');
    assert.equal(record.emailFrequency, 'WEEKLY_EMAIL');
    assert.notEqual(record.password, 'password');
    assert.equal(record.campaign, standard.campaign._id.toString());
  });

  it('should create a new user and normalize the email', async function() {
    const standard = await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/user`, {
      method: 'post',
      body: JSON.stringify({
        email: 'TEST@EDMARKEY.COM',
        password: 'password',
        firstName: 'Test',
        zip: '00000',
        emailFrequency: 'WEEKLY_EMAIL',
      }),
      headers: {
        'Content-Type': 'application/json',
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

  it('should not create a new user if the email is already in use', async function() {
    const standard = await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/user`, {
      method: 'post',
      body: JSON.stringify({
        email: 'ed@edmarkey.com',
        password: 'password',
        firstName: 'Test',
        zip: '00000',
        emailFrequency: 'WEEKLY_EMAIL',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    assert.equal(response.status, 409);

    const { error } = await response.json();
    assert.equal(error, 'validations.existingUser');
  });

  it('should not create a new user if the first name field fails validation', async function() {
    const standard = await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/user`, {
      method: 'post',
      body: JSON.stringify({
        email: 'test@edmarkey.com',
        password: 'password',
        zip: '00000',
        emailFrequency: 'WEEKLY_EMAIL',
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

  it('should not create a new user if the email field fails validation', async function() {
    const standard = await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/user`, {
      method: 'post',
      body: JSON.stringify({
        password: 'password',
        firstName: 'Test',
        zip: '00000',
        emailFrequency: 'WEEKLY_EMAIL',
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

  it('should not create a new user if the password field fails validation', async function() {
    const standard = await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/user`, {
      method: 'post',
      body: JSON.stringify({
        email: 'test@edmarkey.com',
        firstName: 'Test',
        zip: '00000',
        emailFrequency: 'WEEKLY_EMAIL',
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

  it('should not create a new user if the zip field fails validation', async function() {
    const standard = await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/user`, {
      method: 'post',
      body: JSON.stringify({
        email: 'test@edmarkey.com',
        password: 'password',
        firstName: 'Test',
        emailFrequency: 'WEEKLY_EMAIL',
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

  it('should not create a new user if the emailFrequency field fails validation', async function() {
    const standard = await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/user`, {
      method: 'post',
      body: JSON.stringify({
        email: 'test@edmarkey.com',
        password: 'password',
        firstName: 'Test',
        zip: '00000',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    assert.equal(response.status, 400);

    const { field, error } = await response.json();
    assert.equal(field, 'emailFrequency');
    assert.equal(error, 'validations.required');
  });
});
