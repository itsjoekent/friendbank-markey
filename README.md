# ed-markey-relational-organizing

New translations required
- [ ] validations.existingUser
- [ ] validations.passwordLength
- [ ] validations.failedLogin

Should also go back and refactor in (english only):
- [ ] validations.notAuthorized
- [ ] validations.wrongCampaign

* Intercept outgoing network traffic from Container
* Communicate via FS
* Two modes
 * Proxy --> Request & Response written to file
 * Mock --> Set a mock response to a request, track if the endpoint is hit
* NodeJS library for easy usage
* Unless test is specified, defaults to proxy with no IO operations

# Milestone 1

- Allow Ed Markey supporters to update their pages
- Email supporters their signups
- Automated export data process for admins

### Backend Work
- [ ] Forgot password endpoint
- [ ] Emails
 - [ ] Transactional email
 - [ ] Weekly email
- [ ] Indexes

### Frontend Work
- [ ] Refactor routing / initial props to be in the NextJS style
- [ ] New navigation bar
- [ ] Use new endpoints
- [ ] Build versioned static site

### Transition Work


# Milestone 2

- Allow any campaign to pay for the service
- Marketing/Landing page
- Stripe integration for handling payment
- Admin Configuration UI
