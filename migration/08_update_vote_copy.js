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
    'voteStatus.options': {
      [ENGLISH]: [
        'I’ve already voted',
        'I’ve received my mail-in ballot and still need to return it',
        'I’m planning to vote early between October 17-30',
        'I’m planning to vote on Election Day, November 3',
      ],
      [SPANISH]: [
        'Ya vote',
        'He recibido mi boleta por correo y todavía tengo que devolverla',
        'Votaré anticipadamente entre el 17 y el 30 de octubre',
        'Votaré el día de las elecciones, el 3 de noviembre',
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
