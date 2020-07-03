# friendbank

A relational organizing tool developed for Ed Markey's 2020 senate re-elect.

## Local Development

_Requires Docker_.

```sh
$ cp .env.example .env
$ make start
```

App is available at localhost:5000

You can also run `make unit-test-api` to run the API test suite.

- copy all emails button
- next/back buttons
- test for edit signup

- translation for new fields
- migration for new copy fields
  - phonebankPage.successfullySubmitted

----

* Media endpoint test
* Finish migration script

----

- Migration script for Markey
 - Attach users to Markey campaign
 - Add Markey copy to Markey campaign
 - Add Markey env to Markey campaign
 - Add Markey theme to Markey campaign

1. Attach users to campaigns
2. Create admin dashboard for
  - modifying configuration
  - add/remove staff accounts
  - top-line stats about the campaign? (think: AB Dashboard)
3. API endpoint for updating the configuration, updating account roles, getting campaign stats
4. Move the background assets to campaign configuration
5. Custom image uploader for staff on the page create/edit
6. Move BSD ENV vars to campaign model
7. Move theme to campaign model
