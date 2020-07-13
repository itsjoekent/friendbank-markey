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
  fakeSignup,
} = require('./_faker');

const _readServiceOutput = require('../__services/_readServiceOutput');

describe('editSignup api route v1', function() {
  it('should edit a signup', async function() {
    const standard = await standardTestSetup();

    const signup = await fakeSignup({
      campaign: standard.campaign._id.toString(),
      recruitedBy: standard.user._id.toString(),
      email: 'test@gmail.com',
    });

    const response = await fetch(`${API_URL}/api/v1/signup/${signup._id.toString()}`, {
      method: 'put',
      body: JSON.stringify({
        email: 'supporter@gmail.com',
        firstName: 'First 1',
        lastName: 'Last 1',
        phone: '000 000 0000',
        zip: '00000',
        supportLevel: 'Definitely',
        volunteerLevel: 'Yes',
        ballotStatus: 'Submitted',
        actions: '1,2,3',
        note: 'This is a note',
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
    assert.equal(record.firstName, 'First 1');
    assert.equal(record.lastName, 'Last 1');
    assert.equal(record.phone, '+10000000000');
    assert.equal(record.zip, '00000');
    assert.equal(record.supportLevel, 'Definitely');
    assert.equal(record.volunteerLevel, 'Yes');
    assert.equal(record.note, 'This is a note');
    assert.equal(record.ballotStatus, 'Submitted');
    assert.equal(record.actions, '1,2,3');
  });

  it('should edit a contact and send the data to bsd', async function() {
    const standard = await standardTestSetup();

    const signup = await fakeSignup({
      campaign: standard.campaign._id.toString(),
      recruitedBy: standard.user._id.toString(),
      email: 'test@gmail.com',
    });

    const response = await fetch(`${API_URL}/api/v1/signup/${signup._id.toString()}`, {
      method: 'put',
      body: JSON.stringify({
        email: 'supporter@gmail.com',
        firstName: 'First',
        lastName: 'Last',
        note: 'Test',
      }),
      headers: {
        'Content-Type': 'application/json',
        'X-Relational-Token': standard.token,
      },
    });

    assert.equal(response.status, 200);

    const payload = await _readServiceOutput('bsd');
    assert.include(payload.url, process.env.BSD_CONTACT_FORM_SLUG);
    assert.include(payload.body, 'email=supporter%40gmail.com');
    assert.include(payload.body, 'firstname=First');
    assert.include(payload.body, `${process.env.BSD_CONTACT_FRIEND_ID}=${encodeURIComponent('ed@edmarkey.com')}`);
    assert.include(payload.body, `${process.env.BSD_CONTACT_NOTE_ID}=Test`);
  });

  it('should not edit a signup if it does not exist', async function() {
    const standard = await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/signup/5edab93fb9b67300043bc73f`, {
      method: 'put',
      body: JSON.stringify({
        email: 'supporter@gmail.com',
        firstName: 'First 1',
      }),
      headers: {
        'Content-Type': 'application/json',
        'X-Relational-Token': standard.token,
      },
    });

    assert.equal(response.status, 404);

    const { error } = await response.json();
    assert.isString(error);
  });

  it('should not edit a signup if the user is not the recruiter', async function() {
    const standard = await standardTestSetup();

    const signup = await fakeSignup({
      campaign: standard.campaign._id.toString(),
      recruitedBy: '1',
      email: 'test@gmail.com',
    });

    const response = await fetch(`${API_URL}/api/v1/signup/${signup._id.toString()}`, {
      method: 'put',
      body: JSON.stringify({
        email: 'supporter@gmail.com',
        firstName: 'First 1',
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

  it('should edit a signup if the user is not the recruiter but is staff', async function() {
    const standard = await standardTestSetup();

    const client = await MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true });
    const signups = client.db().collection('signups');
    const users = client.db().collection('users');

    await users.updateOne({ _id: standard.user._id }, { '$set': { role: 'STAFF_ROLE' } });

    const signup = await fakeSignup({
      campaign: standard.campaign._id.toString(),
      recruitedBy: '1',
      email: 'test@gmail.com',
    });

    const response = await fetch(`${API_URL}/api/v1/signup/${signup._id.toString()}`, {
      method: 'put',
      body: JSON.stringify({
        email: 'supporter@gmail.com',
        firstName: 'First 1',
      }),
      headers: {
        'Content-Type': 'application/json',
        'X-Relational-Token': standard.token,
      },
    });

    assert.equal(response.status, 200);

    const record = await signups.findOne({ _id: signup._id });

    assert.equal(record.firstName, 'First 1');
  });

  it('should not let any account edit a signup from a different campaign', async function() {
    const standard = await standardTestSetup();

    const client = await MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true });
    const signups = client.db().collection('signups');
    const users = client.db().collection('users');

    await users.updateOne({ _id: standard.user._id }, { '$set': { role: 'STAFF_ROLE' } });

    const signup = await fakeSignup({
      campaign: '1',
      recruitedBy: standard.user._id.toString(),
      email: 'test@gmail.com',
    });

    const response = await fetch(`${API_URL}/api/v1/signup/${signup._id.toString()}`, {
      method: 'put',
      body: JSON.stringify({
        email: 'supporter@gmail.com',
        firstName: 'First 1',
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

  it('should return an error if the email field fails validation', async function() {
    const standard = await standardTestSetup();

    const signup = await fakeSignup({
      campaign: standard.campaign._id.toString(),
      recruitedBy: standard.user._id.toString(),
      email: 'test@gmail.com',
    });

    const response = await fetch(`${API_URL}/api/v1/signup/${signup._id.toString()}`, {
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

  it('should return an error if the firstName field fails validation', async function() {
    const standard = await standardTestSetup();

    const signup = await fakeSignup({
      campaign: standard.campaign._id.toString(),
      recruitedBy: standard.user._id.toString(),
      email: 'test@gmail.com',
    });

    const response = await fetch(`${API_URL}/api/v1/signup/${signup._id.toString()}`, {
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

  it('should return an error if the lastName field fails validation', async function() {
    const standard = await standardTestSetup();

    const signup = await fakeSignup({
      campaign: standard.campaign._id.toString(),
      recruitedBy: standard.user._id.toString(),
      email: 'test@gmail.com',
    });

    const response = await fetch(`${API_URL}/api/v1/signup/${signup._id.toString()}`, {
      method: 'put',
      body: JSON.stringify({
        lastName: '',
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

  it('should return an error if the zip field fails validation', async function() {
    const standard = await standardTestSetup();

    const signup = await fakeSignup({
      campaign: standard.campaign._id.toString(),
      recruitedBy: standard.user._id.toString(),
      email: 'test@gmail.com',
    });

    const response = await fetch(`${API_URL}/api/v1/signup/${signup._id.toString()}`, {
      method: 'put',
      body: JSON.stringify({
        zip: '123456',
      }),
      headers: {
        'Content-Type': 'application/json',
        'X-Relational-Token': standard.token,
      },
    });

    assert.equal(response.status, 400);

    const { field, error } = await response.json();
    assert.equal(field, 'zip');
    assert.equal(error, 'validations.zipFormat');
  });

  it('should return an error if the phone field fails validation', async function() {
    const standard = await standardTestSetup();

    const signup = await fakeSignup({
      campaign: standard.campaign._id.toString(),
      recruitedBy: standard.user._id.toString(),
      email: 'test@gmail.com',
    });

    const response = await fetch(`${API_URL}/api/v1/signup/${signup._id.toString()}`, {
      method: 'put',
      body: JSON.stringify({
        phone: 'abcdefghij',
      }),
      headers: {
        'Content-Type': 'application/json',
        'X-Relational-Token': standard.token,
      },
    });

    assert.equal(response.status, 400);

    const { field, error } = await response.json();
    assert.equal(field, 'phone');
    assert.equal(error, 'validations.phoneFormat');
  });

  it('should return an error if the supportLevel field fails validation', async function() {
    const standard = await standardTestSetup();

    const signup = await fakeSignup({
      campaign: standard.campaign._id.toString(),
      recruitedBy: standard.user._id.toString(),
      email: 'test@gmail.com',
    });

    const response = await fetch(`${API_URL}/api/v1/signup/${signup._id.toString()}`, {
      method: 'put',
      body: JSON.stringify({
        supportLevel: '',
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

  it('should return an error if the volunteerLevel field fails validation', async function() {
    const standard = await standardTestSetup();

    const signup = await fakeSignup({
      campaign: standard.campaign._id.toString(),
      recruitedBy: standard.user._id.toString(),
      email: 'test@gmail.com',
    });

    const response = await fetch(`${API_URL}/api/v1/signup/${signup._id.toString()}`, {
      method: 'put',
      body: JSON.stringify({
        volunteerLevel: '',
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

  it('should return an error if the note field fails validation', async function() {
    const standard = await standardTestSetup();

    const signup = await fakeSignup({
      campaign: standard.campaign._id.toString(),
      recruitedBy: standard.user._id.toString(),
      email: 'test@gmail.com',
    });

    const response = await fetch(`${API_URL}/api/v1/signup/${signup._id.toString()}`, {
      method: 'put',
      body: JSON.stringify({
        note: new Array(2001).fill('a').join(''),
      }),
      headers: {
        'Content-Type': 'application/json',
        'X-Relational-Token': standard.token,
      },
    });

    assert.equal(response.status, 400);

    const { field, error } = await response.json();
    assert.equal(field, 'note');
    assert.equal(error, 'validations.noteLength');
  });

  it('should return an error if not authenticated', async function() {
    const standard = await standardTestSetup();

    const signup = await fakeSignup({
      campaign: standard.campaign._id.toString(),
      recruitedBy: standard.user._id.toString(),
      email: 'test@gmail.com',
    });

    const response = await fetch(`${API_URL}/api/v1/signup/${signup._id.toString()}`, {
      method: 'put',
      body: JSON.stringify({
        email: 'supporter@gmail.com',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    assert.equal(response.status, 401);

    const { error } = await response.json();
    assert.isString(error);
  });

  it('should return an error if domain is not configured', async function() {
    const campaign = await fakeCampaign({ domains: [] });
    const user = await fakeUser({ campaign: campaign._id.toString() });
    const token = await fakeToken({ user: user._id.toString() });

    const client = await MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true });

    const signup = await fakeSignup({
      campaign: campaign._id.toString(),
      recruitedBy: user._id.toString(),
      email: 'test@gmail.com',
    });

    const response = await fetch(`${API_URL}/api/v1/signup/${signup._id.toString()}`, {
      method: 'put',
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
