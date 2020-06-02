const fetch = require('node-fetch');
const chai = require('chai');
const { MongoClient } = require('mongodb');

const { API_URL, MONGODB_URL } = process.env;

// Reference: https://www.chaijs.com/api/assert/
const assert = chai.assert;

require('./_setup');

const { standardTestSetup } = require('./_faker');

const _readServiceOutput = require('../__services/_readServiceOutput');

describe('forgotPassword api route v1', function() {
  it('should trigger a password reset when presented a valid email', async function() {
    const standard = await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/forgot-password`, {
      method: 'post',
      body: JSON.stringify({
        email: 'ed@edmarkey.com',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    assert.equal(response.status, 200);

    const message = await _readServiceOutput('mail');
    assert.equal(message.to, 'ed@edmarkey.com');
    assert.equal(message.dynamic_template_data.campaignName, standard.campaign.name);

    const client = await MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true });
    const tokensCollection = client.db().collection('tokens')
    const tokens = await tokensCollection.find().sort({ expiresAt: 1 }).toArray();
    const mostRecentToken = tokens[0];

    assert.equal(message.dynamic_template_data.resetUrl, `https://api:5000/friendbank/reset-password?token=${mostRecentToken._id}`)
    assert.equal(mostRecentToken.user, standard.user._id.toString());
  });

  it('should not trigger a forgot password if the email field fails validation', async function() {
    await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/forgot-password`, {
      method: 'post',
    });

    assert.equal(response.status, 400);

    const { field, error } = await response.json();
    assert.equal(field, 'email');
    assert.equal(error, 'validations.required');
  });

  it('should return a successful response but no email for an invalid email', async function() {
    const standard = await standardTestSetup();

    const response = await fetch(`${API_URL}/api/v1/forgot-password`, {
      method: 'post',
      body: JSON.stringify({
        email: 'ed@edmarkey.com',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    assert.equal(response.status, 200);

    const message = await _readServiceOutput('mail');
    assert.doesNotHaveAnyKeys(message);
  });
});
