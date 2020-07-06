const fs = require('fs').promises;
const path = require('path');

const express = require('express');
const secure = require('express-force-https');
const { MongoClient, ObjectId } = require('mongodb');

const loadCampaign = require('./middleware/loadCampaign');
const loadToken = require('./middleware/loadToken');

const createPage = require('./routes/createPage');
const getPage = require('./routes/getPage');
const editPage = require('./routes/editPage');
const signup = require('./routes/signup');
const editSignup = require('./routes/editSignup');
const contact = require('./routes/contact');
const getUser = require('./routes/getUser');
const createUser = require('./routes/createUser');
const editUser = require('./routes/editUser');
const getUserPages = require('./routes/getUserPages');
const getUserSignups = require('./routes/getUserSignups');
const login = require('./routes/login');
const logout = require('./routes/logout');
const forgotPassword = require('./routes/forgotPassword');
const uploadMedia = require('./routes/uploadMedia');

const setupDb = require('./db/setup');
const getCampaignForDomain = require('./db/getCampaignForDomain');

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

  IS_PROD,
} = process.env;

const app = express();

if (IS_PROD) {
  app.use(secure);
}

app.use(express.json());

app.use(express.static('public', {
  setHeaders: (res, path, stat) => {
    if (path.includes('/fonts/')) {
      res.set('Cache-Control', 'max-age=31104000, public');
    }

    if (IS_PROD && !path.includes('/dist/')) {
      res.set('Cache-Control', 'max-age=31104000, public');
    }
  },
}));

let db = null;
let template = null;
let errorPage = null;

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

app.put(
  '/api/v1/signup/:id',
  async function(req, res, next) {
    await loadToken({ db })(req, res, next);
  },
  async function(req, res, next) {
    await loadCampaign({ db })(req, res, next);
  },
  async function(req, res) {
    await editSignup({ db })(req, res);
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

app.get(
  '/api/v1/user',
  async function(req, res, next) {
    await loadToken({ db })(req, res, next);
  },
  async function(req, res) {
    await getUser({ db })(req, res);
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

app.get(
  '/api/v1/user/pages',
  async function(req, res, next) {
    await loadToken({ db })(req, res, next);
  },
  async function(req, res, next) {
    await loadCampaign({ db })(req, res, next);
  },
  async function(req, res) {
    await getUserPages({ db })(req, res);
  },
);

app.get(
  '/api/v1/user/signups',
  async function(req, res, next) {
    await loadToken({ db })(req, res, next);
  },
  async function(req, res, next) {
    await loadCampaign({ db })(req, res, next);
  },
  async function(req, res) {
    await getUserSignups({ db })(req, res);
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
  async function(req, res, next) {
    await loadCampaign({ db })(req, res, next);
  },
  async function(req, res) {
    await forgotPassword({ db })(req, res);
  },
);

app.post(
  '/api/v1/media',
  async function(req, res, next) {
    await loadToken({ db})(req, res, next);
  },
  async function(req, res) {
    await uploadMedia({ db })(req, res);
  },
);

app.get('*', async function (req, res) {
  try {
    const { path } = req;

    const host = req.get('host');
    const campaign = await getCampaignForDomain(db, host);

    if (campaign instanceof Error) {
      throw campaign;
    }

    global.location = { pathname: path };
    global.window = {
      __CAMPAIGN_COPY: JSON.parse(campaign.copy),
      __CAMPAIGN_CONFIG: JSON.parse(campaign.config),
    };

    const ssrResult = await ssr(path, { db, campaign, ObjectId });

    global.location = undefined;
    global.window = undefined;

    if (ssrResult instanceof Error) {
      console.error(ssrResult);
      throw ssrResult;
    }

    const {
      html,
      headElements,
      styleElements,
      scriptElements,
      initialProps,
    } = ssrResult;

    const page = template.replace(/{{REACT_DATA}}/g, JSON.stringify(initialProps))
      .replace(/{{CAMPAIGN_COPY}}/g, campaign.copy)
      .replace(/{{CAMPAIGN_CONFIG}}/g, campaign.config)
      .replace(/{{HEAP_TAG}}/g, IS_PROD ? PROD_HEAP : DEV_HEAP)
      .replace(/{{HEAD}}/g, headElements)
      .replace(/{{HTML}}/g, html)
      .replace(/{{STYLE_TAGS}}/g, styleElements);

    res.set('Content-Type', 'text/html');
    res.send(page);
  } catch (error) {
    console.error(error);

    res.set('Content-Type', 'text/html');
    res.status(500).send(errorPage);
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
    template = await fs.readFile(path.join(__dirname, 'template.200.html'), 'utf-8');
    errorPage = await fs.readFile(path.join(__dirname, 'template.500.html'), 'utf-8');
  } catch (error) {
    console.log('Failed to read HTML template');
    console.error(error);
    process.exit(1);
  }

  app.listen(PORT, () => console.log(`Listening on ${PORT}`));
})();
