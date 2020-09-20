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

## Deployment

Friendbank can run anywhere that supports Docker containers, for the Markey campaign we used [Heroku](http://heroku.com/) for it's simplicity, but all major cloud providers should have no issues hosting Friendbank.

Friendbank requires a MongoDB deployment, we recommend [MongoDB Atlas](https://www.mongodb.com/cloud/atlas), along with a [SendGrid](https://sendgrid.com/) account for transactional email, and an [AWS account](https://aws.amazon.com/) with an S3 bucket to host images.

## Customization

To customize the default copy or photo options, edit `src/api/db/seed.js` and seed the database. User accounts with admin permission can also edit copy from within the tool.

To edit the overall site branding,

```
# Colors, fonts, etc
src/frontend/theme.js

# Campaign Logo
src/frontend/components/Nav.js
```
