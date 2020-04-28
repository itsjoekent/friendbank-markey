const fs = require('fs').promises;
const path = require('path');

const express = require('express');
const MongoClient = require('mongodb').MongoClient;

const phone = require('phone');

const Filter = require('bad-words');
const wordFilter = new Filter();

const { PORT, MONGODB_URL } = process.env;

const app = express();
let db = null;

app.use(express.json());
app.use(express.static('public'));

function createApiError(error, status, safeMessage) {
  const target = error instanceof Error ? error : new Error('internal api error');
  console.log({target, error});

  target._status = status;
  target._safeMessage = safeMessage;

  return target;
}

const DEFAULT_API_ERROR_MESSAGE = 'Server error';
function apiErrorHandler(res, error) {
  console.error(error);

  if (error._status) {
    res.status(error._status).json({ error: error.safeMessage || DEFAULT_API_ERROR_MESSAGE });
    return;
  }

  res.status(500).json({ error: DEFAULT_API_ERROR_MESSAGE });
}

function normalizePageCode(code) {
  return encodeURIComponent((code || '').trim().toLowerCase());
}

async function getPageForCode(code) {
  try {
    const pages = db.collection('pages');
    const signups = db.collection('signups');

    const page = await pages.findOne({ code });

    return page;
  } catch (error) {
    return createApiError(error, 500, 'Error retrieving page from database');
  }
}

function transformPageResponse(page) {
  if (!page) {
    return null;
  }

  const copy = { ...page };

  delete copy.createdByLastName;
  delete copy.createdByPhone;
  delete copy.createdByZip;

  return copy;
}

function stringFieldValidator(minLength, maxLength = Infinity) {
  function validate(input) {
    return (
      !!input
      && typeof input === 'string'
      && input.length >= minLength
      && input.length < maxLength
    );
  }

  return validate;
}

function hasInvalidParam(list, validator) {
  return !!list.find((item) => validator(item));
}

app.get('/api/v1/page/:code', async function(req, res) {
  try {
    const { code } = req.params;
    const page = await getPageForCode(normalizePageCode(code));

    if (page instanceof Error) {
      throw page;
    }

    if (!page) {
      res.status(404).json({ error: 'Page not found' });
      return;
    }

    res.json({ page: transformPageResponse(page) });
  } catch (error) {
    apiErrorHandler(res, error);
  }
});

app.post('/api/v1/page/:code', async function(req, res) {
  try {
    const { code } = req.params;

    const {
      createdByFirstName,
      createdByLastName,
      createdByPhone,
      createdByZip,
      title,
      subtitle,
      background,
    } = req.body;

    const requiredStringFields = [
      createdByFirstName,
      createdByLastName,
      title,
      subtitle,
      background,
      `${createdByPhone}`,
      `${createdByZip}`,
    ];

    if (hasInvalidParam(requiredFields, stringFieldValidator(1))) {
      res.status(400).json({ error: 'Missing required field' });
      return;
    }

    if (hasInvalidParam([createdByFirstName, createdByLastName], stringFieldValidator(1, 50))) {
      res.status(400).json({ error: 'Invalid first or last name field length' });
      return;
    }

    if (hasInvalidParam([createdByFirstName, createdByLastName], stringFieldValidator(1, 250))) {
      res.status(400).json({ error: 'Invalid title field length' });
      return;
    }

    const profanityCheck = [
      code,
      createdByFirstName,
      title,
      subtitle,
    ];

    if (hasInvalidParam(profanityCheck, wordFilter.isProfane)) {
      res.status(400).json({ error: 'Profanity is not allowed, sorry!' });
      return;
    }

    if (!phone(createdByPhone, 'USA').length) {
      res.status(400).json({ error: 'Invalid phone number' });
      return;
    }

    if (!stringFieldValidator(5)(createdByZip) || !parseInt(createdByZip)) {
      res.status(400).json({ error: 'Invalid zipcode' });
      return;
    }

    let isValidBackground = false;

    try {
      await fs.access(path.join(process.cwd(), '/public', '/assets', background));
      isValidBackground = true;
    } catch (error) {}

    if (!isValidBackground) {
      res.status(400).json({ error: 'Invalid background' });
      return;
    }

    const normalizedPageCode = normalizePageCode(code);
    const existingPage = await getPageForCode(normalizedPageCode);

    if (existingPage instanceof Error) {
      throw existingPage;
    }

    if (existingPage) {
      res.status(409).json({ error: 'This code is in use already.' });
      return;
    }

    const page = {
      code: normalizedPageCode,
      createdByFirstName: createdByFirstName.trim(),
      createdByLastName: createdByLastName.trim(),
      createdByPhone: phone(createdByPhone, 'USA')[0],
      createdByZip: parseInt(createdByZip),
      createdAt: Date.now(),
      title: title.trim(),
      subtitle: subtitle.trim(),
      totalSignups: 0,
      background,
    };

    await pages.insertOne(page);

    // submit new row to google sheet

    res.json({ page });
  } catch (error) {
    apiErrorHandler(res, error);
  }
});

app.post('/api/v1/page/:code/signup', async function(req, res) {

});

app.get('*', async function (req, res) {
  try {

  } catch (error) {
    console.error(error);
    res.status(500).send('Whoops, looks like something is broken. We\'ll be back momentarily!');
  }
});

(async function() {
  try {
    const client = await MongoClient.connect(MONGODB_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    db = client.db('markey');

    app.listen(PORT, () => console.log(`Listening on ${PORT}`));
  } catch (error) {
    console.log('Failed to connect to MongoDB');
    console.error(error);
    process.exit(1);
  }
})();
