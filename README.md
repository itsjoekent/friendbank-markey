# friendbank

A relational organizing tool developed for Ed Markey's 2020 senate re-elect. [Read more about the relational organizing strategy Team Markey employed](https://medium.com/@emma.h.friend/ed-markeys-relational-first-organizing-approach-137bbfc4852).

**In The Wild!!**

- [Tedra Cobb, NY-21](https://tedra-friendbank.herokuapp.com/)

## Local Development

_Requires Docker_.

```sh
$ cp .env.example .env
$ make start
```

App is available at `localhost:5000`.

You can also run `make unit-test-api` to run the API test suite.

## Deployment

Friendbank can run anywhere that supports Docker containers, for the Markey campaign we used [Heroku](http://heroku.com/) for it's simplicity, but all major cloud providers should have no issues hosting Friendbank.

Once your app is deployed, make sure to seed the production database (`MONGODB_URL=... npm run seed`).

Friendbank requires a MongoDB deployment, we recommend [MongoDB Atlas](https://www.mongodb.com/cloud/atlas), along with a [SendGrid](https://sendgrid.com/) account for transactional email, and an [AWS account](https://aws.amazon.com/) with an S3 bucket to host images.

**Note on Heroku deployment**:
By default, Heroku does not detect a Docker stack. Run `heroku stack:set container` in the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) and re-deploy the application.

**Note on Sengrid:**
For setting up the dynamic email templates, I've copied the two templates we used on the Markey campaign.
- [Transaction Signup Notification](https://github.com/itsjoekent/friendbank/blob/master/Transactional-Signup-Notification-Template.html)
- [Forgot Password](https://github.com/itsjoekent/friendbank/blob/master/Forgot-Password-Template.html)

**Note on production environment variables:**
When deploying Friendbank, if your campaign does not use the Blue State Digital Tools, ignore the `BSD_` environment variables and set `DEBUG_CRM_SIGNUP=true`.

## Customization

To customize the default copy or photo options, edit `src/api/db/seed.js` and seed the database (`make seed`). User accounts with admin permission can also edit copy from within the tool.

To edit the overall site branding,

```
# Colors, fonts, etc
src/frontend/theme.js

# Campaign Logo
src/frontend/components/Nav.js
```
