const fs = require('fs').promises;
const path = require('path');

const express = require('express');
const MongoClient = require('mongodb').MongoClient;

const fetch = require('node-fetch');

const xss = require('xss');
const phoneValidation = require('phone');
const profanity = require('@2toad/profanity').profanity;

const setupDb = require('./setup-db');
const ssr = require('./ssr').default;

const backgrounds = require('../backgrounds');

const {
  PORT,
  MONGODB_URL,

  BSD_SIGNUP_FORM_SLUG,
  BSD_SIGNUP_CODE_ID,
  BSD_SIGNUP_SUPPORT_ID,
  BSD_SIGNUP_VOLUNTEER_ID,

  CACHE_PUBLIC_ASSETS,
} = process.env;

const app = express();

app.use(express.json());
app.use(express.static('public', {
  setHeaders: (res, path, stat) => {
    if (!CACHE_PUBLIC_ASSETS) {
      return;
    }

    if (!path.includes('/dist/')) {
      res.set('Cache-Control', 'max-age=31104000, public');
    }
  },
}));

let db = null;
let template = null;

function createApiError(error, status, safeMessage) {
  const target = error instanceof Error ? error : new Error('internal api error');

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

function normalizeName(value) {
  return xss(value.trim());
}

function normalizeEmail(value) {
  return value.trim().toLowerCase();
}

async function getPageForCode(code) {
  try {
    const pages = db.collection('pages');

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
  delete copy.createdByEmail;
  delete copy.createdByPhone;
  delete copy.createdByZip;

  return copy;
}

function stringFieldValidator(minLength, maxLength = Infinity) {
  function validate(input) {
    return (
      typeof input !== 'string'
      || input === 'undefined'
      || input.length < minLength
      || input.length > maxLength
    );
  }

  return validate;
}

function hasInvalidParam(list, validator) {
  return list.findIndex((item) => validator(item)) > -1;
}

async function submitBsdForm(fields) {
  try {
    const url = `https://markey.cp.bsd.net/page/sapi/${BSD_SIGNUP_FORM_SLUG}`;

    const body = Object.keys(fields).reduce((acc, key) => {
      const prepend = acc.length ? '&' : '';

      return `${acc}${prepend}${encodeURIComponent(key)}=${encodeURIComponent(fields[key])}`;
    }, '');

    const options = {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body,
    };

    const response = await fetch(url, options);

    return response;
  } catch (error) {
    return error;
  }
}

app.get('/api/v1/health', async function(req, res) {
  res.json({ ok: true });
});

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
      firstName,
      lastName,
      email,
      phone,
      zip,
      title,
      subtitle,
      background,
      supportLevel,
      volunteerLevel,
    } = req.body;

    const requiredStringFields = [
      firstName,
      lastName,
      title,
      subtitle,
      background,
      email,
      supportLevel,
      volunteerLevel,
      `${phone}`,
      `${zip}`,
    ];

    if (hasInvalidParam(requiredStringFields, stringFieldValidator(1))) {
      res.status(400).json({ error: 'Missing required field' });
      return;
    }

    if (hasInvalidParam([firstName, lastName], stringFieldValidator(1, 50))) {
      res.status(400).json({ error: 'Invalid first and/or last name field length' });
      return;
    }

    if (hasInvalidParam([title], stringFieldValidator(1, 450))) {
      res.status(400).json({ error: 'Invalid title field length' });
      return;
    }

    if (hasInvalidParam([subtitle], stringFieldValidator(1, 2000))) {
      res.status(400).json({ error: 'Invalid subtitle field length' });
      return;
    }

    if (code.length > 50 || !(/^[a-zA-Z0-9-_]+$/.test(code))) {
      res.status(400).json({ error: 'Invalid share code, must be less than 50 characters and only use letters, numbers, dashes and underscores.' });
      return;
    }

    const profanityCheck = [
      code,
      firstName,
      title,
      subtitle,
    ];

    if (hasInvalidParam(profanityCheck, (field) => profanity.exists(field))) {
      res.status(400).json({ error: 'Profanity is not allowed, sorry!' });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      res.status(400).json({ error: 'Invalid email' });
      return;
    }

    if (!phoneValidation(phone, 'USA').length) {
      res.status(400).json({ error: 'Invalid phone number' });
      return;
    }

    if (`${zip}`.length !== 5 || !(/^\d+$/.test(zip))) {
      res.status(400).json({ error: 'Invalid zipcode' });
      return;
    }

    if (!backgrounds[background]) {
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
      createdByFirstName: normalizeName(firstName),
      createdByLastName: normalizeName(lastName),
      createdByEmail: normalizeEmail(email),
      createdByPhone: phoneValidation(phone, 'USA')[0],
      createdByZip: `${zip}`,
      createdAt: Date.now(),
      title: xss(title.trim()),
      subtitle: xss(subtitle.trim()),
      totalSignups: 0,
      background: background.toLowerCase(),
    };

    const bsdResult = await submitBsdForm({
      email: page.createdByEmail,
      firstname: page.createdByFirstName,
      lastname: page.createdByLastName,
      phone: page.createdByPhone,
      zip: page.createdByZip,
      [BSD_SIGNUP_CODE_ID]: normalizedPageCode,
      [BSD_SIGNUP_SUPPORT_ID]: supportLevel,
      [BSD_SIGNUP_VOLUNTEER_ID]: volunteerLevel,
    });

    if (bsdResult instanceof Error) {
      throw bsdResult;
    }

    const pages = db.collection('pages');
    await pages.insertOne(page);

    res.json({ page: transformPageResponse(page) });
  } catch (error) {
    apiErrorHandler(res, error);
  }
});

app.post('/api/v1/page/:code/signup/:step', async function(req, res) {
  try {
    const { code, step } = req.params;
    const normalizedCode = normalizePageCode(code);

    const {
      firstName,
      lastName,
      email,
      phone,
      zip,
      supportLevel,
      volunteerLevel,
    } = req.body;

    const requiredStringFields = [
      firstName,
      lastName,
      email,
      `${phone}`,
      `${zip}`,
    ];

    if (step === 2) {
      requiredStringFields.push(supportLevel);
      requiredStringFields.push(volunteerLevel);
    }

    if (hasInvalidParam(requiredStringFields, stringFieldValidator(1))) {
      res.status(400).json({ error: 'Missing required field' });
      return;
    }

    if (hasInvalidParam([firstName, lastName], stringFieldValidator(1, 50))) {
      res.status(400).json({ error: 'Invalid first and/or last name field length' });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      res.status(400).json({ error: 'Invalid email' });
      return;
    }

    if (!phoneValidation(phone, 'USA').length) {
      res.status(400).json({ error: 'Invalid phone number' });
      return;
    }

    if (`${zip}`.length !== 5 || !(/^\d+$/.test(zip))) {
      res.status(400).json({ error: 'Invalid zipcode' });
      return;
    }

    const pages = db.collection('pages');

    const bsdForm = {
      email: email,
      firstname: firstName,
      lastname: lastName,
      phone: phone,
      zip: zip,
      [BSD_SIGNUP_CODE_ID]: normalizedCode,
    };

    if (step === '1') {
      const pageUpdateResult = await pages.updateOne(
        { code: normalizedCode },
        { '$inc': { totalSignups: 1 } },
        { upsert: false },
      );

      if (!pageUpdateResult.result.nModified) {
        res.status(404).json({ error: 'Page not found' });
        return;
      }

      if (!pageUpdateResult.result.ok) {
        // Better to collect the signup data instead of request error termination.
        console.error(`error updating total page signups, page_code=${normalizedCode}`);
      }
    }

    if (step === '2') {
      const page = await getPageForCode(normalizedCode);

      if (page instanceof Error) {
        throw page;
      }

      if (!page) {
        res.status(404).json({ error: 'Page not found' });
        return;
      }

      bsdForm[BSD_SIGNUP_SUPPORT_ID] = supportLevel;
      bsdForm[BSD_SIGNUP_VOLUNTEER_ID] = volunteerLevel;
    }

    const bsdResult = await submitBsdForm(bsdForm);

    if (bsdResult instanceof Error) {
      throw bsdResult;
    }

    res.json({ ok: true });
  } catch (error) {
    apiErrorHandler(res, error);
  }
});

function fillTemplate(config = {}) {
  const title = config.title || 'Support Ed Markey';
  const description = config.description || 'This is a people-powered movement. We are building the largest, most inclusive, grassroots campaign in Massachusetts, and it starts and ends with you.';
  const cover = config.cover || '/assets/em-header-original.jpg';
  const status = config.status || 200;

  const data = config.data || { pageType: 'notfound' };

  const ssrResult = ssr(data);
  if (ssrResult instanceof Error) {
    console.error(ssrResult);
    return 'Yikes, we\'re experiencing some errors. Hang tight!';
  }

  const { html, styleTags } = ssrResult;

  return template.replace(/{{REACT_DATA}}/g, JSON.stringify(data))
    .replace(/{{HTML}}/g, html)
    .replace(/{{STYLE_TAGS}}/g, styleTags)
    .replace(/{{TITLE}}/g, title)
    .replace(/{{DESCRIPTION}}/g, description)
    .replace(/{{COVER}}/g, cover);
}

app.get('*', async function (req, res) {
  try {
    const { path } = req;

    res.set('Content-Type', 'text/html');

    if (path === '/') {
      res.send(fillTemplate({
        data: { pageType: 'homepage' },
      }));

      return;
    }

    const page = await getPageForCode(normalizePageCode(path.replace('/', '')));

    if (page instanceof Error) {
      throw page;
    }

    if (!page) {
      res.status(404).send(fillTemplate({
        title: 'Ed Markey | Page Not Found',
        data: { pageType: 'notfound' },
      }));

      return;
    }

    res.send(fillTemplate({
      title: page.title,
      description: page.subtitle,
      cover: page.background,
      data: { pageType: 'signup', page },
    }));

  } catch (error) {
    console.error(error);

    res.status(500).send(fillTemplate({
      title: 'Ed Markey | Server Error',
      data: { pageType: 'error' },
    }));
  }
});

(async function() {
  try {
    const client = await MongoClient.connect(MONGODB_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    db = client.db();

    const result = await setupDb(db);

    if (result instanceof Error) {
      throw result;
    }
  } catch (error) {
    console.log('Failed to connect to MongoDB');
    console.error(error);
    process.exit(1);
  }

  try {
    template = await fs.readFile(path.join(__dirname, 'template.html'), 'utf-8');
  } catch (error) {
    console.log('Failed to read HTML template');
    console.error(error);
    process.exit(1);
  }

  app.listen(PORT, () => console.log(`Listening on ${PORT}`));
})();
