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

describe('getPage api route v1', function() {
  it('should get a page', async function() {
    const standard = await standardTestSetup();

    const client = await MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true });
    const pages = client.db().collection('pages');

    await pages.insertOne({
      code: 'test',
      campaign: standard.campaign._id.toString(),
      createdBy: standard.user._id.toString(),
      title: 'Demo page title',
      subtitle: 'Demo page subtitle',
      background: 'default',
    });

    const response = await fetch(`${API_URL}/api/v1/page/test`, {
      method: 'get',
    });

    assert.equal(response.status, 200);

    const { page } = await response.json();

    assert.isObject(page);
    assert.isUndefined(page._id);
    assert.isUndefined(page.campaign);
    assert.isUndefined(page.createdBy);
    assert.equal(page.code, 'test');
    assert.equal(page.title, 'Demo page title');
    assert.equal(page.subtitle, 'Demo page subtitle');
    assert.equal(page.background, 'default');
  });

  it('should not get a page if the page does not exist', async function() {
    const standard = await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/page/test`, {
      method: 'get',
    });

    assert.equal(response.status, 404);

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
    });

    const response = await fetch(`${API_URL}/api/v1/page/test`, {
      method: 'get',
    });

    assert.equal(response.status, 403);

    const { error } = await response.json();
    assert.isString(error);
  });
});
