const { MongoClient, ObjectId } = require('mongodb');

const {
  MONGODB_URL,
} = process.env;

/**
 * Import csv of existing signups and add to database
 * with proper page source attribution.
 */
