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
    'idQuestions.vote.label': {
      [ENGLISH]: 'Are you planning to vote by mail for Ed in the Massachusetts primary?',
    },
    'idQuestions.vote.subtitle': {
      [ENGLISH]: 'Voting by mail is the safest way to make your voice heard in this election, and new laws have expanded access to vote by mail in Massachusetts for every registered voter. An application to vote by mail will be mailed to each registered voter in MA (or you can download one and mail or email it in). Just complete that application, send it back, and you’ll receive a ballot to vote for Ed by mail. Skip the polls, stay safe, and get your vote for Ed in early -- vote by mail!',
    },
    'idQuestions.vote.options': {
      [ENGLISH]: [
        'Yes, and I’ve already sent in my vote by mail application',
        'Yes, and I need a vote by mail application',
        'No, I’m not sure about voting by mail',
        'I’d like to learn more about voting by mail',
      ],
    },
    'actions.gotv.label': {
      [ENGLISH]: 'GOTV Actions',
    },
    'actions.gotv.options': {
      [ENGLISH]: [
        'Received Ballot Application',
        'Mailed in Ballot Application',
        'Received Ballot',
        'Voted for Ed! (Mailed in completed ballot)',
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
