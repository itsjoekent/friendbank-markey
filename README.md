# ed-markey-relational-organizing

Ship 1:
- [x] Back button
- [x] Missing Spanish translations
- [x] Update FE logic for new validation error

-----

Relational organizing tool for Ed Markey's senate race

- [ ] Convert to a signup endpoint + create page endpoint
  - [ ] Reuse same validation functions
- [ ] Creating page just requires email, first name...
 - [ ] New field for email frequency
 - [ ] Generate a unique auth code per page
- [ ] Signup endpoint creates a signup record
 - [ ] Filling out multiple times updates the signup record
 - [ ] Total signups per page is a count
- [ ] Create an edit page route (/:slug/edit/:code)
  - [ ] Validates the auth code is real
  - [ ] Presents Homepage step 2 fields
  - [ ] Requires API route (/api/v1/:slug/edit/:code) that does code validation
- [ ] Create recurring job to email all page owners based on email frequency setting
 - [ ] Add edit link to email
 - [ ] Add all signups sorted by date
- [ ] Migrate existing data
 - [ ] Import signups
 - [ ] Email all existing page owners

```js
// page
{
  _id: ObjectId, // index
  code: String, // index
  title: String,
  subtitle: String,
  background: String,
  authorization: String,
  frequency: String<"weekly","bi-daily","none">,
  createdByEmail: String,
  createdByFirstName: String,
  createdByZip: String,
  createdAt: Date,
}

// signup
{
  _id: ObjectId,
  signupCode: String, // index
  email: String, // index
  phone: String,
  firstName: String,
  lastName: String,
  phone: String,
  zip: String,
  supportLevel: String,
  volunteerLevel: String,
  createdAt: Date,
  lastUpdatedAt: Date,
}
```
