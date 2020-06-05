const { promises: fs } = require('fs');
const { join } = require('path');

const { MongoClient, ObjectId } = require('mongodb');

const {
  MONGODB_URL,
} = process.env;

const getPageForCode = require('../src/api/db/getPageForCode');
const BSD_VAN_MAP = require('../src/api/utils/markeyVanFields');

function flipVanMap(input) {
  const output = {};

  Object.keys(input).forEach((key) => {
    if (!output[input[key]]) {
      output[input[key]] = key;
    }
  });

  return output;
}

BSD_VAN_MAP.support = flipVanMap({ ...BSD_VAN_MAP.support });
BSD_VAN_MAP.volunteer = flipVanMap({ ...BSD_VAN_MAP.volunteer });

/**
 * Import csv of existing signups and add to database
 * with proper page source attribution.
 */

async function read(path) {
  try {
    const content = await fs.readFile(
      join(__dirname, path),
      { encoding: 'utf8' },
    );

    const [header, ...rows] = content.split('\n');

    const keys = header.split(',');

    const data = rows.reduce((table, row) => {
      const values = [''];
      let valueIndex = 0;
      let isEscapedBlock = false;

      for (const char of row) {
        if (char === ',' && !isEscapedBlock) {
          values.push('');
          valueIndex = values.length - 1;
        } else if (char === '"') {
          if (isEscapedBlock) {
            isEscapedBlock = false;
          } else {
            isEscapedBlock = true;
          }
        } else {
          values[valueIndex] = `${values[valueIndex]}${char}`;
        }
      }

      const rowData = keys.reduce((acc, key, index) => ({
        ...acc,
        [key]: values[index],
      }), {});

      return [
        ...table,
        rowData,
      ];
    }, []);

    return data;
  } catch (error) {
   console.error(error);
   process.exit(1);
  }
}

(async function() {
  const client = await MongoClient.connect('...', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  db = client.db();

  const bsdSignups = await read('./bsd-.csv');
  const signups = db.collection('signups');

  for (const bsdSignup of bsdSignups) {
    const inputs = {
      code: bsdSignup[`"Field 6288 volunteer-for-ed-markey: Relational Page Code"`],
      firstName: bsdSignup.firstname,
      lastName: bsdSignup.lastname,
      phone: bsdSignup.phone,
      zip: bsdSignup.zip,
      email: bsdSignup.email,
    };

    const supportLevelRaw = bsdSignup[`"Field 6295 volunteer-for-ed-markey: Will you vote for Ed Markey"`];
    if (supportLevelRaw) {
      inputs.supportLevel = BSD_VAN_MAP.support[supportLevelRaw];
    }

    const volunteerLevelRaw = bsdSignup['"Field 6291 volunteer-for-ed-markey: Will you volunteer with Team"'];
    if (volunteerLevelRaw) {
      inputs.volunteerLevel = BSD_VAN_MAP.volunteer[volunteerLevelRaw];
    }

    const fields = {};

    Object.keys(inputs)
      .filter((key) => typeof inputs[key] !== 'undefined')
      .forEach((key) => fields[key] = inputs[key]);

    if (!Object.keys(fields).length || !fields.email) {
      continue;
    }

    let recruitedBy = null;
    if (fields.code) {
      const pageMatch = await getPageForCode(
        db,
        '5edab93fb9b67300043bc73f',
        fields.code,
      );

      if (pageMatch && pageMatch.createdBy) {
        recruitedBy = pageMatch.createdBy;
      }
    }

    const signup = {
      ...fields,
      campaign: '5edab93fb9b67300043bc73f',
      recruitedBy,
      type: 'subscriber',
      lastUpdatedAt: Date.now(),
      __bsd_import: true,
    };

    console.log(`updating signup for email=${signup.email}`)

    await signups.updateOne(
      {
        email: signup.email,
        recruitedBy: signup.recruitedBy,
        campaign: signup.campaign,
      },
      { '$set': signup },
      { upsert: true },
    );
  }
})();
