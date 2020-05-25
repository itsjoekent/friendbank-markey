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

describe('getUserPages api route v1', function() {
  it('should get a user page', async function() {
    const standard = await standardTestSetup();

    const client = await MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true });
    const pagesCollection = client.db().collection('pages');

    const pageInsertResult = await pagesCollection.insertOne({
      code: 'test',
      title: 'Demo page title',
      subtitle: 'Demo page subtitle',
      background: 'default',
      campaign: standard.campaign._id.toString(),
      createdBy: standard.user._id.toString(),
    });

    const insertedPage = pageInsertResult.ops[0];

    const response = await fetch(`${API_URL}/api/v1/user/pages`, {
      method: 'get',
      headers: {
        'X-Relational-Token': standard.token,
      },
    });

    assert.equal(response.status, 200);

    const { pages, lastId, total } = await response.json();

    assert.equal(total, 1);
    assert.equal(lastId, insertedPage._id.toString());
    assert.isArray(pages);
    assert.isObject(pages[0]);
    assert.isUndefined(pages[0]._id);
    assert.isUndefined(pages[0].campaign);
    assert.isUndefined(pages[0].createdBy);
    assert.equal(pages[0].code, 'test');
    assert.equal(pages[0].title, 'Demo page title');
    assert.equal(pages[0].subtitle, 'Demo page subtitle');
    assert.equal(pages[0].background, 'default');
  });

  it('should paginate user pages', async function() {
    const standard = await standardTestSetup();

    const client = await MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true });
    const pagesCollection = client.db().collection('pages');

    const insertedPages = await pagesCollection.insertMany(
      new Array(50).fill({}).reduce((acc, val, index) => ([
        ...acc,
        {
          code: `test-${index}`,
          title: `Demo page title ${index}`,
          subtitle: 'Demo page subtitle',
          background: 'default',
          campaign: standard.campaign._id.toString(),
          createdBy: standard.user._id.toString(),
        },
      ]), [])
    );

    const initialResponse = await fetch(`${API_URL}/api/v1/user/pages`, {
      method: 'get',
      headers: {
        'X-Relational-Token': standard.token,
      },
    });

    assert.equal(initialResponse.status, 200);

    const initialJson = await initialResponse.json();

    assert.lengthOf(initialJson.pages, 25);
    assert.equal(initialJson.total, 50);
    assert.equal(initialJson.lastId, insertedPages.ops[24]._id.toString());
    assert.equal(initialJson.pages[0].code, 'test-0');
    assert.equal(initialJson.pages[0].title, 'Demo page title 0');
    assert.equal(initialJson.pages[24].code, 'test-24');
    assert.equal(initialJson.pages[24].title, 'Demo page title 24');

    const paginatedResponse = await fetch(`${API_URL}/api/v1/user/pages?lastId=${initialJson.lastId}`, {
      method: 'get',
      headers: {
        'X-Relational-Token': standard.token,
      },
    });

    assert.equal(paginatedResponse.status, 200);

    const paginatedJson = await paginatedResponse.json();

    assert.lengthOf(paginatedJson.pages, 25);
    assert.equal(paginatedJson.total, 50);
    assert.equal(paginatedJson.lastId, insertedPages.ops[49]._id.toString());
    assert.equal(paginatedJson.pages[0].code, 'test-25');
    assert.equal(paginatedJson.pages[0].title, 'Demo page title 25');
    assert.equal(paginatedJson.pages[24].code, 'test-49');
    assert.equal(paginatedJson.pages[24].title, 'Demo page title 49');
  });

  it('should not get user pages if not authenticated', async function() {
    const standard = await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/user/pages`, {
      method: 'get',
    });

    assert.equal(response.status, 401);

    const { error } = await response.json();
    assert.isString(error);
  });

  it ('should return an error if domain is not configured', async function() {
    const campaign = await fakeCampaign({ domains: [] });
    const user = await fakeUser({ campaign: campaign._id.toString() });
    const token = await fakeToken({ user: user._id.toString() });

    const response = await fetch(`${API_URL}/api/v1/user/pages`, {
      method: 'get',
      headers: {
        'X-Relational-Token': token._id.toString(),
      },
    });

    assert.equal(response.status, 403);

    const { error } = await response.json();
    assert.isString(error);
  });
});
