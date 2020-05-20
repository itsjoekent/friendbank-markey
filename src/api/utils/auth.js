const bcrypt = require('bcrypt');
const { promisify } = require('util');
const crypto = require('crypto');

const randomBytes = promisify(crypto.randomBytes);

async function randomToken() {
  try {
    const token = await randomBytes(64);
    return token.toString('hex');
  } catch (error) {
    return error;
  }
}

async function passwordHash(plaintext) {
  try {
    const result = await bcrypt.hash(plaintext, 10);
    return result;
  } catch (error) {
    return error;
  }
}

async function passwordCompare(plaintext, hashed) {
  try {
    const comparison = await bcrypt.compare(plaintext, hashed);
    return comparison;
  } catch (error) {
    return error;
  }
}

module.exports = {
  randomBytes,
  randomToken,
  passwordHash,
  passwordCompare,
}
