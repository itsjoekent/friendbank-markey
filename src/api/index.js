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

const { SPANISH_PREFIX } = require('../shared/lang');
const backgrounds = require('../shared/backgrounds');
const fieldValidations = require('../shared/fieldValidations');

const DEV_HEAP = `
<script type="text/javascript">
window.heap=window.heap||[],heap.load=function(e,t){window.heap.appid=e,window.heap.config=t=t||{};var r=document.createElement("script");r.type="text/javascript",r.async=!0,r.src="https://cdn.heapanalytics.com/js/heap-"+e+".js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(r,a);for(var n=function(e){return function(){heap.push([e].concat(Array.prototype.slice.call(arguments,0)))}},p=["addEventProperties","addUserProperties","clearEventProperties","identify","resetIdentity","removeEventProperty","setEventProperties","track","unsetEventProperty"],o=0;o<p.length;o++)heap[p[o]]=n(p[o])};
heap.load("2521914575");
</script>
`;

const PROD_HEAP = `
<script type="text/javascript">
  window.heap=window.heap||[],heap.load=function(e,t){window.heap.appid=e,window.heap.config=t=t||{};var r=document.createElement("script");r.type="text/javascript",r.async=!0,r.src="https://cdn.heapanalytics.com/js/heap-"+e+".js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(r,a);for(var n=function(e){return function(){heap.push([e].concat(Array.prototype.slice.call(arguments,0)))}},p=["addEventProperties","addUserProperties","clearEventProperties","identify","resetIdentity","removeEventProperty","setEventProperties","track","unsetEventProperty"],o=0;o<p.length;o++)heap[p[o]]=n(p[o])};
  heap.load("1893784860");
</script>
`;

const {
  PORT,
  MONGODB_URL,

  BSD_API_BASE_URL,
  BSD_SIGNUP_FORM_SLUG,
  BSD_SIGNUP_CODE_ID,
  BSD_SIGNUP_SUPPORT_ID,
  BSD_SIGNUP_VOLUNTEER_ID,

  CACHE_PUBLIC_ASSETS,
  IS_PROD_HEAP,
} = process.env;

const app = express();

const BSD_VAN_MAP = {
  support: {
    'Definitely': '1433903',
    'Probably': '1433904',
    'Undecided': '1433905',
    'Probably not': '1465097',
    'Definitely not': '1465098',
    'Too Young/Ineligible to Vote': '1598130',

    'Definitivamente': '1433903',
    'Probablemente': '1433904',
    'Indeciso': '1433905',
    'Probablemente no': '1465097',
    'Definitivamente no': '1465098',
    'Demasiado joven/Inelegible para votar': '1598130',
  },
  volunteer: {
    'Yes': '1411494',
    'Maybe': '1411495',
    'Later': '1411496',
    'No': '1411497',

    'Sí': '1411494',
    'Tal vez': '1411495',
    'Más tarde': '1411496',
    'No': '1411497',
  },
};

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

function profanityCheck(value) {
  return profanity.exists(value) ? 'validations.profanity' : false;
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

function normalizePhone(value) {
  return phoneValidation(value, '', true)[0];
}

function normalizeBackground(value) {
  return value.toLowerCase();
}

function validateAndNormalizeApiRequestFields(fields) {
  const validations = {
    firstName: [
      fieldValidations.validateName,
      profanityCheck,
    ],
    lastName: [
      fieldValidations.validateName,
    ],
    zip: [
      fieldValidations.validateZip,
    ],
    email: [
      fieldValidations.validateEmail,
    ],
    phone: [
      fieldValidations.validatePhone,
    ],
    code: [
      fieldValidations.validateCode,
      profanityCheck,
    ],
    title: [
      fieldValidations.validateTitle,
      profanityCheck,
    ],
    subtitle: [
      fieldValidations.validateSubtitle,
      profanityCheck,
    ],
    supportLevel: [
      fieldValidations.validateRequired,
    ],
    volunteerLevel: [
      fieldValidations.validateRequired,
    ],
    background: [
      fieldValidations.validateBackground,
    ],
  };

  const normalizations = {
    code: normalizePageCode,
    firstName: normalizeName,
    lastName: normalizeName,
    email: normalizeEmail,
    phone: normalizePhone,
    title: normalizeName,
    subtitle: normalizeName,
    background: normalizeBackground,
  };

  return Object.keys(fields).reduce((acc, key) => {
    if (Array.isArray(acc)) {
      return acc;
    }

    const value = `${fields[key] || ''}`;

    const validationMessage = validations[key]
      ? validations[key]
        .map((validator) => validator((value)))
        .find(validation => !!validation)
      : false;

    if (validationMessage) {
      return [key, validationMessage];
    }

    return {
      ...acc,
      [key]: normalizations[key] ? normalizations[key](value) : value,
    }
  }, {});
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

async function submitBsdForm(fields) {
  try {
    const url = `${BSD_API_BASE_URL}/page/sapi/${BSD_SIGNUP_FORM_SLUG}`;

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

    const validationResult = validateAndNormalizeApiRequestFields({
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
      code,
    });

    if (Array.isArray(validationResult)) {
      res.status(400).json({
        field: validationResult[0],
        error: validationResult[1],
      });

      return;
    }

    const existingPage = await getPageForCode(validationResult.code);

    if (existingPage instanceof Error) {
      throw existingPage;
    }

    if (existingPage) {
      res.status(409).json({ error: 'This code is in use already.' });
      return;
    }

    const page = {
      code: validationResult.code,
      createdByFirstName: validationResult.firstName,
      createdByLastName: validationResult.lastName,
      createdByEmail: validationResult.email,
      createdByPhone: validationResult.phone,
      createdByZip: validationResult.zip,
      createdAt: Date.now(),
      title: validationResult.title,
      subtitle: validationResult.subtitle,
      totalSignups: 0,
      background: validationResult.background,
    };

    const bsdResult = await submitBsdForm({
      email: page.createdByEmail,
      firstname: page.createdByFirstName,
      lastname: page.createdByLastName,
      phone: page.createdByPhone,
      zip: page.createdByZip,
      [BSD_SIGNUP_CODE_ID]: page.code,
      [BSD_SIGNUP_SUPPORT_ID]: BSD_VAN_MAP.support[supportLevel],
      [BSD_SIGNUP_VOLUNTEER_ID]: BSD_VAN_MAP.volunteer[volunteerLevel],
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

    const validationRequirements = {
      firstName,
      lastName,
      email,
      phone,
      zip,
    };

    if (step === 2) {
      validationRequirements.supportLevel = supportLevel;
      validationRequirements.volunteerLevel = volunteerLevel;
    }

    const validationResult = validateAndNormalizeApiRequestFields(validationRequirements);

    if (Array.isArray(validationResult)) {
      res.status(400).json({
        field: validationResult[0],
        error: validationResult[1],
      });

      return;
    }

    const pages = db.collection('pages');

    const bsdForm = {
      email: validationResult.email,
      firstname: validationResult.firstName,
      lastname: validationResult.lastName,
      phone: validationResult.phone,
      zip: validationResult.zip,
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

      bsdForm[BSD_SIGNUP_SUPPORT_ID] = BSD_VAN_MAP.support[supportLevel];
      bsdForm[BSD_SIGNUP_VOLUNTEER_ID] = BSD_VAN_MAP.volunteer[volunteerLevel];
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

function fillTemplate(req, config = {}) {
  const title = config.title || 'Create your own Ed Markey supporter page';
  const description = config.description || 'Our grassroots campaign is powered by people like you who are connecting with family, friends, and neighbors about this important election.';
  const cover = config.cover || 'https://ed-markey-supporter-photos.s3.amazonaws.com/Taylor+St.+Germain+-+P2+Markey+(52+of+70).jpg';
  const status = config.status || 200;

  const data = config.data || { pageType: 'notfound' };

  global.location = { pathname: req.path };

  const ssrResult = ssr(data);

  global.location = undefined;

  if (ssrResult instanceof Error) {
    console.error(ssrResult);
    return 'Yikes, we\'re experiencing some errors. Hang tight!';
  }

  const { html, styleTags } = ssrResult;

  return template.replace(/{{REACT_DATA}}/g, JSON.stringify(data))
    .replace(/{{HTML}}/g, html)
    .replace(/{{HEAP_TAG}}/g, IS_PROD_HEAP ? PROD_HEAP : DEV_HEAP)
    .replace(/{{STYLE_TAGS}}/g, styleTags)
    .replace(/{{TITLE}}/g, title)
    .replace(/{{DESCRIPTION}}/g, description)
    .replace(/{{COVER}}/g, cover);
}

app.get('*', async function (req, res) {
  try {
    const { path } = req;

    res.set('Content-Type', 'text/html');

    if (path === '/' || path.replace(/\/$/, '') === SPANISH_PREFIX) {
      res.send(fillTemplate(req, {
        data: { pageType: 'homepage' },
      }));

      return;
    }

    const slug = path.startsWith(SPANISH_PREFIX)
      ? path.replace(SPANISH_PREFIX, '').replace('/', '')
      : path.replace('/', '');

    const page = await getPageForCode(normalizePageCode(slug));

    if (page instanceof Error) {
      throw page;
    }

    if (!page) {
      res.status(404).send(fillTemplate(req, {
        title: 'Ed Markey | Page Not Found',
        data: { pageType: 'notfound' },
      }));

      return;
    }

    res.send(fillTemplate(req, {
      title: page.title,
      description: page.subtitle,
      cover: backgrounds[page.background].source,
      data: { pageType: 'signup', page },
    }));

  } catch (error) {
    console.error(error);

    res.status(500).send(fillTemplate(req, {
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
