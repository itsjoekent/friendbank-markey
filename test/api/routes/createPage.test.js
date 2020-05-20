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

describe('createPage api route v1', function() {
  it ('should create a new page', async function() {
    const standard = await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/page/test`, {
      method: 'post',
      body: JSON.stringify({
        title: 'Demo page title',
        subtitle: 'Demo page subtitle',
        background: 'default',
      }),
      headers: {
        'Content-Type': 'application/json',
        'X-Relational-Token': standard.token,
      },
    });

    assert.equal(response.status, 200);

    const { page } = await response.json();

    assert.isObject(page);
    assert.isOk(page._id);
    assert.equal(page.campaign, standard.campaign._id.toString());
    assert.equal(page.createdBy, standard.user._id.toString());
    assert.equal(page.code, 'test');
    assert.equal(page.title, 'Demo page title');
    assert.equal(page.subtitle, 'Demo page subtitle');
    assert.equal(page.background, 'default');
  });

  it ('should not create a new page if the code is already in use', async function() {
    const standard = await standardTestSetup();

    const client = await MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true });
    const db = client.db();
    const pages = db.collection('pages');

    await pages.insertOne({
      code: 'test',
      campaign: standard.campaign._id.toString(),
    });

    const response = await fetch(`${API_URL}/api/v1/page/test`, {
      method: 'post',
      body: JSON.stringify({
        title: 'Demo page title',
        subtitle: 'Demo page subtitle',
        background: 'default',
      }),
      headers: {
        'Content-Type': 'application/json',
        'X-Relational-Token': standard.token,
      },
    });

    assert.equal(response.status, 409);

    const { error } = await response.json();
    assert.isString(error);
  });

  it ('should return an error if title field validation fails', async function() {
    const standard = await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/page/test`, {
      method: 'post',
      body: JSON.stringify({
        subtitle: 'Demo page subtitle',
        background: 'default',
      }),
      headers: {
        'Content-Type': 'application/json',
        'X-Relational-Token': standard.token,
      },
    });

    assert.equal(response.status, 400);

    const { field, error } = await response.json();
    assert.equal(field, 'title');
    assert.equal(error, 'validations.required');
  });

  it ('should return an error if subtitle field validation fails', async function() {
    const standard = await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/page/test`, {
      method: 'post',
      body: JSON.stringify({
        title: 'Demo page title',
        background: 'default',
      }),
      headers: {
        'Content-Type': 'application/json',
        'X-Relational-Token': standard.token,
      },
    });

    assert.equal(response.status, 400);

    const { field, error } = await response.json();
    assert.equal(field, 'subtitle');
    assert.equal(error, 'validations.required');
  });

  it ('should return an error if background field validation fails', async function() {
    const standard = await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/page/test`, {
      method: 'post',
      body: JSON.stringify({
        title: 'Demo page title',
        subtitle: 'Demo page subtitle',
      }),
      headers: {
        'Content-Type': 'application/json',
        'X-Relational-Token': standard.token,
      },
    });

    assert.equal(response.status, 400);

    const { field, error } = await response.json();
    assert.equal(field, 'background');
    assert.equal(error, 'validations.required');
  });

  it ('should return an error if not authenticated', async function() {
    const standard = await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/page/test`, {
      method: 'post',
      body: JSON.stringify({
        title: 'Demo page title',
        subtitle: 'Demo page subtitle',
        background: 'default',
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

    const response = await fetch(`${API_URL}/api/v1/page/test`, {
      method: 'post',
      body: JSON.stringify({
        title: 'Demo page title',
        subtitle: 'Demo page subtitle',
        background: 'default',
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
