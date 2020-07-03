const ms = require('ms');
const { MongoClient } = require('mongodb');
const { MONGODB_URL } = process.env;
const { passwordHash } = require('../../../src/api/utils/auth');
const { USER_ROLE } = require('../../../src/shared/roles');
const { WEEKLY_EMAIL } = require('../../../src/shared/emailFrequency');

async function fakeSignup({
  email = '',
  recruitedBy = '',
  campaign = '',
  type = 'contact',
  firstName = 'First',
  lastName = 'Last',
  phone = '',
  zip = '',
  supportLevel = '',
  volunteerLevel = '',
  note = '',
}) {
  const client = await MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true });
  const db = client.db();
  const signups = db.collection('signups');

  const result = await signups.insertOne({
    email,
    recruitedBy,
    campaign,
    type,
    lastUpdatedAt: Date.now(),
    firstName,
    lastName,
    phone,
    zip,
    supportLevel,
    volunteerLevel,
    note,
  });

  return result.ops[0];
}

async function fakeUser({
  campaign = '',
  email = 'ed@edmarkey.com',
  password = 'password',
  firstName = 'Ed',
  zip = '00000',
  emailFrequency = WEEKLY_EMAIL,
  role = USER_ROLE,
}) {
  const client = await MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true });
  const db = client.db();
  const users = db.collection('users');

  const hashedPassword = await passwordHash(password);

  const result = await users.insertOne({
    campaign,
    email,
    password: hashedPassword,
    firstName,
    zip,
    emailFrequency,
    role,
    createdAt: Date.now(),
    lastUpdatedAt: Date.now(),
    lastAuthenticationUpdate: '1',
  });

  return result.ops[0];
}

async function fakeToken({
  tokenValue = '123',
  user = '',
  expiresAt = Date.now() + ms('30 days'),
}) {
  const client = await MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true });
  const db = client.db();
  const tokens = db.collection('tokens');

  const result = await tokens.insertOne({
    _id: tokenValue,
    user,
    expiresAt,
    lauCompare: '1',
  });

  return result.ops[0];
}

async function fakeMedia({
  _id = 'default',
  type = 'image',
  source = 'https://ed-markey-supporter-photos.s3.amazonaws.com/em-header-original.jpg',
  alt = 'Ed at the Podium',
}) {
  const client = await MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true });
  const db = client.db();
  const media = db.collection('media');

  const result = await media.insertOne({
    _id: 'default',
    type: 'image',
    source: 'https://ed-markey-supporter-photos.s3.amazonaws.com/em-header-original.jpg',
    alt: 'Ed at the Podium',
  });

  return result.ops[0];
}

async function fakeCampaign({
  domains = ['api:5000'],
  name = 'Team Markey',
  config = {
    media: [
      'default',
    ],
  },
  copy = {},
}) {
  const client = await MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true });
  const db = client.db();
  const campaigns = db.collection('campaigns');

  const result = await campaigns.insertOne({
    domains,
    name,
    copy: JSON.stringify(copy),
    config: JSON.stringify(config),
    lastUpdatedAt: Date.now(),
    updateLog: [],
  });

  return result.ops[0];
}

async function fakePage({
  title,
  subtitle,
  background,
  code,
  campaign,
  user,
}) {
  const client = await MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true });
  const db = client.db();
  const pages = db.collection('pages');

  const result = await pages.insertOne({
    title,
    subtitle,
    background,
    code,
    campaign,
    user,
  });

  return result.ops[0];
}

async function standardTestSetup() {
  await fakeMedia({});
  const campaign = await fakeCampaign({});
  const user = await fakeUser({ campaign: campaign._id.toString() });
  const token = await fakeToken({ user: user._id.toString() });

  return {
    token: token._id.toString(),
    user,
    campaign,
  };
}

module.exports = {
  fakeSignup,
  fakeUser,
  fakeToken,
  fakeMedia,
  fakeCampaign,
  fakePage,
  standardTestSetup,
};
