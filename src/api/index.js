const fs = require('fs').promises;
const path = require('path');

const express = require('express');
const MongoClient = require('mongodb').MongoClient;

const loadCampaign = require('./middleware/loadCampaign');
const loadToken = require('./middleware/loadToken');

const createPage = require('./routes/createPage');
const getPage = require('./routes/getPage');
const editPage = require('./routes/editPage');
const signup = require('./routes/signup');
const contact = require('./routes/contact');
const createUser = require('./routes/createUser');
const editUser = require('./routes/editUser');
const login = require('./routes/login');
const logout = require('./routes/logout');
const forgotPassword = require('./routes/forgotPassword');

const setupDb = require('./db/setup');
const ssr = require('./ssr').default;

const { SPANISH_PREFIX } = require('../shared/lang');
const backgrounds = require('../shared/backgrounds');

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

app.get('/api/v1/health', async function(req, res) {
  res.json({ ok: true });
});

app.get(
  '/api/v1/page/:code',
  async function(req, res, next) {
    await loadCampaign({ db })(req, res, next);
  },
  async function(req, res) {
    await getPage({ db })(req, res);
  },
);

app.post(
  '/api/v1/page/:code',
  async function(req, res, next) {
    await loadToken({ db })(req, res, next);
  },
  async function(req, res, next) {
    await loadCampaign({ db })(req, res, next);
  },
  async function(req, res) {
    await createPage({ db })(req, res);
  },
);

app.put(
  '/api/v1/page/:code',
  async function(req, res, next) {
    await loadToken({ db })(req, res, next);
  },
  async function(req, res, next) {
    await loadCampaign({ db })(req, res, next);
  },
  async function(req, res) {
    await editPage({ db })(req, res);
  },
);

app.post(
  '/api/v1/signup',
  async function(req, res, next) {
    await loadCampaign({ db })(req, res, next);
  },
  async function(req, res) {
    await signup({ db })(req, res);
  },
);

app.post(
  '/api/v1/contact',
  async function(req, res, next) {
    await loadToken({ db })(req, res, next);
  },
  async function(req, res, next) {
    await loadCampaign({ db })(req, res, next);
  },
  async function(req, res) {
    await contact({ db })(req, res);
  },
);

app.post(
  '/api/v1/user',
  async function(req, res) {
    await createUser({ db })(req, res);
  },
);

app.put(
  '/api/v1/user',
  async function(req, res, next) {
    await loadToken({ db })(req, res, next);
  },
  async function(req, res) {
    await editUser({ db })(req, res);
  },
);

app.post(
  '/api/v1/login',
  async function(req, res) {
    await login({ db })(req, res);
  },
);

app.post(
  '/api/v1/logout',
  async function(req, res, next) {
    await loadToken({ db })(req, res, next);
  },
  async function(req, res) {
    await logout({ db })(req, res);
  },
);

app.post(
  '/api/v1/forgot-password',
  async function(req, res) {
    await forgotPassword({ db })(req, res);
  },
);

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
