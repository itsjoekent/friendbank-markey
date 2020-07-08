const { MongoClient, ObjectId } = require('mongodb');

const {
  MONGODB_URL,
} = process.env;

(async function() {
  const client = await MongoClient.connect('mongodb://heroku_jsts0lkv:hhiil2higst9s5hcbr4q2pglnn@ds239889-a0.mlab.com:39889,ds239889-a1.mlab.com:39889/heroku_jsts0lkv?replicaSet=rs-ds239889&retryWrites=false', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  // const client = await MongoClient.connect(MONGODB_URL, {
  //   useUnifiedTopology: true,
  //   useNewUrlParser: true,
  // });

  db = client.db();

  const campaigns = db.collection('campaigns');
  const markeyCampaign = await campaigns.findOne({ domains: 'support.edmarkey.com' });

  const usersCollection = await db.collection('users');

  await usersCollection.createIndex({ email: 1, campaign: 1 });
  const users = await usersCollection.find().toArray();

  for (const user of users) {
    await usersCollection.updateOne({
      _id: user._id,
    }, {
      '$set': {
        campaign: markeyCampaign._id.toString(),
      },
    });
  }

  process.exit(0);
})();
