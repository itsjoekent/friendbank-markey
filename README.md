# friendbank

A relational organizing tool developed for Ed Markey's 2020 senate re-elect.

## Local Development

_Requires Docker_.

```sh
$ cp .env.example .env
$ make start
```

App is available at `localhost:5000`

You can also run `make unit-test-api` to run the API test suite.

- translation for new fields

- Add new question ballot
  - BSD
  - Signup variables
  - Add to manual contact form and signup flow (_conditional in signup form_)
  - Add question/options to copy configuration
  - Update seed, tests
  - env
- Add actions field
  - BSD
  - Signup variables
  - Add to dashboard
  - Update tests
  - env
- Feature flag in the Admin config for GOTV mode?


Address 500's
<!-- global.location = { pathname: path };
global.window = {
  __CAMPAIGN_COPY: JSON.parse(campaign.copy),
  __CAMPAIGN_CONFIG: JSON.parse(campaign.config),
};

const ssrResult = await ssr(path, { db, campaign, ObjectId });

global.location = undefined;
global.window = undefined; -->
