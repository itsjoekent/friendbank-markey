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

describe('uploadMedia api route v1', function() {
  it('should create a new media object and create a signed s3 url', async function() {
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

    const response = await fetch(`${API_URL}/api/v1/media`, {
      method: 'post',
      body: JSON.stringify({
        alt: 'Alt text',
        fileType: 'jpg',
      }),
      headers: {
        'Content-Type': 'application/json',
        'X-Relational-Token': staffToken._id.toString(),
      },
    });

    assert.equal(response.status, 200);

    const {
      media,
      signedUrl,
    } = await response.json();

    assert.isString(signedUrl);
    assert.isObject(media);
    assert.isString(media._id);
    assert.lengthOf(media._id, 32);
    assert.equal(media.alt, 'Alt text');
    assert.include(media.source, `s3.amazonaws.com/${media._id}.jpg`);

    const client = await MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true });
    const mediaCollection = client.db().collection('media');

    const record = await mediaCollection.findOne({
      _id: media._id,
    });

    assert.equal(record.alt, 'Alt text');
    assert.equal(record.type, 'image');
  });

  it('should not create new media if missing alt', async function() {
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

    const response = await fetch(`${API_URL}/api/v1/media`, {
      method: 'post',
      body: JSON.stringify({
        alt: '',
        fileType: 'jpg',
      }),
      headers: {
        'Content-Type': 'application/json',
        'X-Relational-Token': staffToken._id.toString(),
      },
    });

    assert.equal(response.status, 400);

    const { field, error } = await response.json();
    assert.equal(field, 'alt');
    assert.equal(error, 'validations.required');
  });

  it('should not create new media if missing fileType', async function() {
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

    const response = await fetch(`${API_URL}/api/v1/media`, {
      method: 'post',
      body: JSON.stringify({
        alt: 'Alt text',
      }),
      headers: {
        'Content-Type': 'application/json',
        'X-Relational-Token': staffToken._id.toString(),
      },
    });

    assert.equal(response.status, 400);

    const { field, error } = await response.json();
    assert.equal(field, 'background');
    assert.equal(error, 'validations.required');
  });

  it('should not create new media if using invalid fileType', async function() {
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

    const response = await fetch(`${API_URL}/api/v1/media`, {
      method: 'post',
      body: JSON.stringify({
        alt: 'Alt text',
        fileType: 'mp4',
      }),
      headers: {
        'Content-Type': 'application/json',
        'X-Relational-Token': staffToken._id.toString(),
      },
    });

    assert.equal(response.status, 400);

    const { field, error } = await response.json();
    assert.equal(field, 'background');
    assert.equal(error, 'validations.required');
  });

  it('should not create new media if not authenticated', async function() {
    const standard = await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/media`, {
      method: 'post',
      body: JSON.stringify({
        alt: 'Alt text',
        fileType: 'jpg',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    assert.equal(response.status, 401);

    const { error } = await response.json();
    assert.isString(error);
  });

  it('should not create new media if not a staff user', async function() {
    const standard = await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/media`, {
      method: 'post',
      body: JSON.stringify({
        alt: 'Alt text',
        fileType: 'jpg',
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
});
