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
    'phonebankPage.successfullySubmitted': {
      [ENGLISH]: 'Successfully submitted contact!',
      [SPANISH]: '¡Contacto creado con éxito!',
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
