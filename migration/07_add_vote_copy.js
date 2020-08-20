const { MongoClient, ObjectId } = require('mongodb');

const {
  MONGODB_URL,
} = process.env;

const { ENGLISH, SPANISH } = require('../src/shared/lang');

(async function() {
  const client = await MongoClient.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  db = client.db();

  const campaigns = db.collection('campaigns');

  const markeyCampaign = await campaigns.findOne({ domains: 'support.edmarkey.com' });

  const copy = JSON.stringify({
    ...JSON.parse(markeyCampaign.copy),
    'voteStatus.label': {
      [ENGLISH]: 'Make a plan to vote for Ed in the Massachusetts primary!',
    },
    'voteStatus.subtitle': {
      [ENGLISH]: 'Our future and our planet are on the line. Make your voice heard by making a plan to vote for Ed Markey in the Massachusetts Senate Primary Election. If you have not already applied to vote by mail, please make a plan to vote early or on Election Day.',
    },
    'voteStatus.options': {
      [ENGLISH]: [
        'I’ve already voted',
        'I’ve received my mail-in ballot and still need to return it',
        'I’m planning to vote early between August 22-28',
        'I’m planning to vote on Election Day, September 1',
      ],
    },
  });

  await campaigns.updateOne(
    { domains: 'support.edmarkey.com' },
    {
      '$set': {
        copy,
      },
    },
  );

  process.exit(0);
})();
