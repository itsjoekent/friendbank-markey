const { MongoClient, ObjectId } = require('mongodb');
const setupDb = require('../src/api/db/setup');
const { randomToken } = require('../src/api/utils/auth');
const { TRANSACTIONAL_EMAIL } = require('../src/shared/emailFrequency');

const {
  MONGODB_URL,
} = process.env;

/**
 * 1. Configure the edmarkey campaign
 * 2. Migrate pages to new schema
 * 3. Create user accounts for all existing page authors
 */

(async function() {
  try {
    const client = await MongoClient.connect(MONGODB_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    db = client.db();

    const indexResult = await setupDb(db);

    if (indexResult instanceof Error) {
      throw indexResult;
    }

    const pages = db.collection('pages');
    const users = db.collection('users');
    const campaigns = db.collection('campaigns');

    const markeyCampaignData = {
      domains: [
        'support.edmarkey.com',
      ],
      name: 'Team Markey',
    };

    const campaignInsertResult = await campaigns.insertOne(markeyCampaignData);
    const campaign = campaignInsertResult.ops[0];

    const pages = await pages.find().toArray();

    for (const page of pages) {
      const userData = {
        email: page.createdByEmail,
        password: await randomToken(),
        firstName: page.createdByFirstName,
        zip: page.createdByZip,
        emailFrequency: TRANSACTIONAL_EMAIL,
        createdAt: Date.now(),
        lastUpdatedAt: Date.now(),
        lastAuthenticationUpdate: Date.now(),
      };

      const userInsertResult = await users.insertOne(userData);
      const user = userInsertResult.ops[0];

      const pageUpdate = {
        '$set': {
          campaign: campaign._id.toString(),
          createdBy: user._id.toString(),
          lastUpdatedAt: Date.now(),
          __v: '1',
        },
        '$unset': {
          createdByFirstName: '',
          createdByLastName: '',
          createdByEmail: '',
          createdByPhone: '',
          createdByZip: '',
          totalSignups: '',
        },
      };

      const pages = db.collection('pages');
      await pages.updateOne({ _id: page._id }, pageUpdate);
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
});

// v1 page schema
// {
//     "_id": {
//         "$oid": "5eab38d8c54d590017933971"
//     },
//     "code": "nicole-b-899",
//     "createdByFirstName": "Nicole",
//     "createdByLastName": "Bardasz",
//     "createdByEmail": "nicole@edmarkey.com",
//     "createdByPhone": "+15084238722",
//     "createdByZip": "01886",
//     "createdAt": 1588279510360,
//     "title": "Nicole is sticking with Ed because...",
//     "subtitle": "Ed has been always been righteous fighter for working people and environmental justice. We need him in office now more than ever, bringing these fights\u2013our fights\u2013to the floor of the US Senate.",
//     "totalSignups": 3,
//     "background": "air-flight-89"
// }
