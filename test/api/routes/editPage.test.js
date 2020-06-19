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

describe('editPage api route v1', function() {
  it('should edit a page', async function() {
    const standard = await standardTestSetup();

    const client = await MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true });
    const pages = client.db().collection('pages');

    await pages.insertOne({
      code: 'test',
      campaign: standard.campaign._id.toString(),
      createdBy: standard.user._id.toString(),
    });

    const response = await fetch(`${API_URL}/api/v1/page/test`, {
      method: 'put',
      body: JSON.stringify({
        title: 'Demo page title 2',
        subtitle: 'Demo page subtitle 2',
        background: 'hoops',
      }),
      headers: {
        'Content-Type': 'application/json',
        'X-Relational-Token': standard.token,
      },
    });

    assert.equal(response.status, 200);

    const record = await pages.findOne({
      code: 'test',
      campaign: standard.campaign._id.toString(),
    });

    assert.isObject(record);
    assert.equal(record.campaign, standard.campaign._id.toString());
    assert.equal(record.createdBy, standard.user._id.toString());
    assert.equal(record.code, 'test');
    assert.equal(record.title, 'Demo page title 2');
    assert.equal(record.subtitle, 'Demo page subtitle 2');
    assert.equal(record.background, 'hoops');
  });

  it('should not edit a page if the page does not exist', async function() {
    const standard = await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/page/test`, {
      method: 'put',
      body: JSON.stringify({
        title: 'Demo page title 2',
        subtitle: 'Demo page subtitle 2',
        background: 'hoops',
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

  it('should not edit a page if the user does not have permission', async function() {
    const standard = await standardTestSetup();

    const client = await MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true });
    const pages = client.db().collection('pages');

    await pages.insertOne({
      code: 'test',
      campaign: standard.campaign._id.toString(),
      createdBy: 'test',
    });

    const response = await fetch(`${API_URL}/api/v1/page/test`, {
      method: 'put',
      body: JSON.stringify({
        title: 'Demo page title 2',
        subtitle: 'Demo page subtitle 2',
        background: 'hoops',
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

  it ('should return an error if title field validation fails', async function() {
    const standard = await standardTestSetup();

    const client = await MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true });
    const pages = client.db().collection('pages');

    await pages.insertOne({
      code: 'test',
      campaign: standard.campaign._id.toString(),
      createdBy: standard.user._id.toString(),
    });

    const response = await fetch(`${API_URL}/api/v1/page/test`, {
      method: 'put',
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

    const client = await MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true });
    const pages = client.db().collection('pages');

    await pages.insertOne({
      code: 'test',
      campaign: standard.campaign._id.toString(),
      createdBy: standard.user._id.toString(),
    });

    const response = await fetch(`${API_URL}/api/v1/page/test`, {
      method: 'put',
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

    const client = await MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true });
    const pages = client.db().collection('pages');

    await pages.insertOne({
      code: 'test',
      campaign: standard.campaign._id.toString(),
      createdBy: standard.user._id.toString(),
    });

    const response = await fetch(`${API_URL}/api/v1/page/test`, {
      method: 'put',
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

  it ('should return an error if the background does not exist for the campaign', async function() {
    const standard = await standardTestSetup();

    const client = await MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true });
    const pages = client.db().collection('pages');

    await pages.insertOne({
      code: 'test',
      campaign: standard.campaign._id.toString(),
      createdBy: standard.user._id.toString(),
    });

    const response = await fetch(`${API_URL}/api/v1/page/test`, {
      method: 'put',
      body: JSON.stringify({
        title: 'Demo page title',
        subtitle: 'Demo page subtitle',
        background: 'does-not-exist',
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

    const client = await MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true });
    const pages = client.db().collection('pages');

    await pages.insertOne({
      code: 'test',
      campaign: standard.campaign._id.toString(),
      createdBy: standard.user._id.toString(),
    });

    const response = await fetch(`${API_URL}/api/v1/page/test`, {
      method: 'put',
      body: JSON.stringify({
        title: 'Demo page title 2',
        subtitle: 'Demo page subtitle 2',
        background: 'hoops',
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

    const client = await MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true });
    const pages = client.db().collection('pages');

    await pages.insertOne({
      code: 'test',
      campaign: campaign._id.toString(),
      createdBy: user._id.toString(),
    });

    const response = await fetch(`${API_URL}/api/v1/page/test`, {
      method: 'put',
      body: JSON.stringify({
        title: 'Demo page title 2',
        subtitle: 'Demo page subtitle 2',
        background: 'hoops',
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
