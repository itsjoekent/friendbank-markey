# Multi-tenant refactor

This document outlines the steps necessary to refactor this application to operate as a multi-tenant platform. At the time of writing this, it is not clear their is a market demand for this, and it is not required for the Markey campaign, so I opt-ed to document my thoughts rather than fully execute on them.

Given the possibility the application would go in this direction, a number of engineering considerations have already been made to make this transition easier.

## Authorization

Authorization should ideally be centralized across campaigns, this means users do not need to create a unique account per campaign.

To achieve this,

1. A central authorization portal would need to be created on the `friendbank.us` domain. This should also offer user signup and password reset.
2. When campaign domains redirect users to the auth portal, they should send a `return_to` parameter in the URL. To prevent 3rd-party attacks, this return domain can be validated by querying the campaigns collection for the given domain (this is already an indexed field).
3. When the user successfully logs in (or creates an account), the generated token should be appended to the `return_to` URL as a query parameter. The client application is responsible for parsing out the token, and "cleaning" the URL.

## Onboarding

There will need to be a gated method of granting campaigns / organizations access to the platform, and guiding the first staff account through setting up their instance.

## Configuration

To successfully work across campaigns, much of the application would need to be configurable per campaign. However, all of the configuration data is currently derived from environment variables.

To move off of environment variables, we would need to move configuration details to the Campaign document. Most API endpoints already match the incoming request (based on domain) to a campaign in the database, so this would simply require refactoring the data to be pulled from the campaign configuration field instead of environment variables.

The time intensive part of this will be,

1. Updating API unit tests to use a seed configuration, and covering different configuration scenarios in the codebase/tests.
2. Building out an admin UI for campaign staff to edit the configuration (this will also require adding a `role` field to the user model).
3. Migrating fields out of `getCopy.js`

This configuration step is blocking much of the work defined below.

## Added CRM Support

Currently the friendbank application only works with the EveryAction/Blue State Tools. At a minimum it will also need to work with ActionKit, and it is likely worth surveying what other CRM integrations are necessary.

Supporting multiple CRM's and the implementation quirks of each will heavily rely on the campaign configuration.

## Dynamic Theme

The frontend UI is currently wrapped in a styled-components `ThemeManager`, which enables complex transformations of theme variables based on custom data.

Campaigns would likely want to customize the theme fonts, colors and logo at a minimum. The campaign configuration could define all of these variables and inject them during server-side rendering. Most campaigns rely on a third-party font host (Adobe Fonts, typography.com), so we can probably save time by just having them copy the href from the `<link>` on their current website.

The current styling patterns rely on two different patterns, and mostly two weights. We would want to cut this down to 1 font and ensure we're just using bold + normal.

## Dynamic Form Step

Currently the last step of the signup flow is specific to the Markey campaign. This should be configurable, so campaigns can pick between different field types and set their own questions (or allow them to just remove it entirely).

This will require the frontend and backend signup functions to run dynamic validation based on the campaign configuration. The frontend already supports rendering a dynamic group of fields based on prop data.

## Routing + Code Splitting

If Authorization is moving to a central domain, the frontend routing will need to be domain-aware when deciding what router to use (or two applications could be made, but this seems like more work).

Given the authorization portal, and admin dashboard, we would want to introduce code splitting.

## Frontend Rendering + Caching

Currently the application does not have any cache layer and all traffic hits origin. There are two ways we could approach solving this,

1. Place Edge servers (Fastly, Cloudflare) ahead of the origin server, scale up origin server capacity, and build in cache-clear logic to the API when users create or edit a page.
2. Place Edge servers (Fastly, Cloudflare) ahead of a storage bucket, have the application server push rendered HTML to the storage bucket. [read more](https://joekent.nyc/ssr-react-realtime).

## Community Moderation

If friendbank were to scale to many campaigns, there would need to be a report functionality for malicious pages, a notification to campaign staff, and a way for campaign staff to remove a page.
