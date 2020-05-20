// const fetch = require('node-fetch');
// const chai = require('chai');
//
// const MongoClient = require('mongodb').MongoClient;
//
// const setupDb = require('../../src/api/setup-db');
//
// const { API_URL, MONGODB_URL } = process.env;
//
// // Reference: https://www.chaijs.com/api/assert/
// const assert = chai.assert;
//
// async function sleep(duration) {
//   return new Promise((resolve) => setTimeout(resolve, duration));
// }
//
// before('wait for host to be reachable', async function() {
//   this.timeout(10000);
//
//   async function check() {
//     try {
//       const response = await fetch(`${API_URL}/api/v1/health`);
//
//       if (response.status === 200) {
//         return true;
//       }
//     } catch (error) {}
//
//     await sleep(100);
//
//     return check();
//   }
//
//   await check();
// });
//
// beforeEach('clear database', async function() {
//   const client = await MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true });
//   const db = client.db();
//
//   await db.dropDatabase();
//   await setupDb(db);
//
//   client.close();
// });
//
// describe('page api v1', function() {
//   it ('should return a 404 for a non existent page', async function() {
//     const response = await fetch(`${API_URL}/api/v1/page/test`);
//     assert.equal(response.status, 404);
//
//     const { error } = await response.json();
//     assert.isString(error);
//   });
//
//   it ('should return 200 for an existing page', async function() {
//     const client = await MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true });
//     const db = client.db();
//     const pages = db.collection('pages');
//
//     await pages.insertOne({ code: 'test' });
//
//     const response = await fetch(`${API_URL}/api/v1/page/test`);
//     assert.equal(response.status, 200);
//
//     const json = await response.json();
//     assert.equal(json.page.code, 'test');
//     assert.isOk(json.page._id);
//   });
//
//   it ('should create a new page with valid parameters', async function () {
//   });
//
//   it ('should trim string fields', async function () {
//     const response = await fetch(`${API_URL}/api/v1/page/test`, {
//       method: 'post',
//       body: JSON.stringify({
//         firstName: 'Ed   ',
//         lastName: 'Markey',
//         email: 'ed@edmarkey.com',
//         phone: '+16175550127',
//         zip: '02129',
//         title: 'Demo page title      ',
//         subtitle: '   Demo page subtitle',
//         supportLevel: 'Definitely',
//         volunteerLevel: 'Yes',
//         background: 'default',
//       }),
//       headers: { 'Content-Type': 'application/json' },
//     });
//
//     assert.equal(response.status, 200);
//
//     const { page } = await response.json();
//
//     assert.equal(page.createdByFirstName, 'Ed');
//     assert.equal(page.title, 'Demo page title');
//     assert.equal(page.subtitle, 'Demo page subtitle');
//   });
//

//
//   it ('should normalize the uppercase code', async function () {
//     const response = await fetch(`${API_URL}/api/v1/page/TEST`, {
//       method: 'post',
//       body: JSON.stringify({
//         firstName: 'Ed   ',
//         lastName: 'Markey',
//         email: 'ed@edmarkey.com',
//         phone: '+16175550127',
//         zip: '02129',
//         title: 'Demo page title      ',
//         subtitle: '   Demo page subtitle',
//         supportLevel: 'Definitely',
//         volunteerLevel: 'Yes',
//         background: 'default',
//       }),
//       headers: { 'Content-Type': 'application/json' },
//     });
//
//     assert.equal(response.status, 200);
//
//     const { page } = await response.json();
//
//     assert.equal(page.code, 'test');
//   });
//
//   it ('should not create a new page if the code has an invalid character', async function() {
//     const response = await fetch(`${API_URL}/api/v1/page/test!`, {
//       method: 'post',
//       body: JSON.stringify({
//         firstName: 'Ed',
//         lastName: 'Markey',
//         email: 'ed@edmarkey.com',
//         phone: '+16175550127',
//         zip: '02129',
//         title: 'Demo page title',
//         subtitle: 'Demo page subtitle',
//         supportLevel: 'Definitely',
//         volunteerLevel: 'Yes',
//         background: 'default',
//       }),
//       headers: { 'Content-Type': 'application/json' },
//     });
//
//     assert.equal(response.status, 400);
//
//     const { error, field } = await response.json();
//     assert.equal(error, 'validations.codeFormat');
//     assert.equal(field, 'code');
//   });
//
//   it ('should not create a new page if the code is longer than 50 characters', async function() {
//     const response = await fetch(`${API_URL}/api/v1/page/test12345678910111213141516171819202122232425262728293031323334353637383934041424344454647484950`, {
//       method: 'post',
//       body: JSON.stringify({
//         firstName: 'Ed',
//         lastName: 'Markey',
//         email: 'ed@edmarkey.com',
//         phone: '+16175550127',
//         zip: '02129',
//         title: 'Demo page title',
//         subtitle: 'Demo page subtitle',
//         supportLevel: 'Definitely',
//         volunteerLevel: 'Yes',
//         background: 'default',
//       }),
//       headers: { 'Content-Type': 'application/json' },
//     });
//
//     assert.equal(response.status, 400);
//
//     const { error, field } = await response.json();
//     assert.equal(error, 'validations.codeLength');
//     assert.equal(field, 'code');
//   });
//
//   it ('should not create a new page if the first name is missing', async function() {
//     const response = await fetch(`${API_URL}/api/v1/page/test`, {
//       method: 'post',
//       body: JSON.stringify({
//         lastName: 'Markey',
//         email: 'ed@edmarkey.com',
//         phone: '+16175550127',
//         zip: '02129',
//         title: 'Demo page title',
//         subtitle: 'Demo page subtitle',
//         supportLevel: 'Definitely',
//         volunteerLevel: 'Yes',
//         background: 'default',
//       }),
//       headers: { 'Content-Type': 'application/json' },
//     });
//
//     assert.equal(response.status, 400);
//
//     const { error, field } = await response.json();
//     assert.equal(error, 'validations.required');
//     assert.equal(field, 'firstName');
//   });
//
//   it ('should not create a new page if the first name is greater than 50 characters', async function() {
//     const response = await fetch(`${API_URL}/api/v1/page/test`, {
//       method: 'post',
//       body: JSON.stringify({
//         firstName: 'EdEdEdEdEdEdEdEdEdEdEdEdEdEdEdEdEdEdEdEdEdEdEdEdEdEdEdEdEdEdEdEdEdEdEdEdEdEdEdEdEdEdEdEdEdEdEdEdEdEdEdEdEdEdEdEdEdEdEdEdEd',
//         lastName: 'Markey',
//         email: 'ed@edmarkey.com',
//         phone: '+16175550127',
//         zip: '02129',
//         title: 'Demo page title',
//         subtitle: 'Demo page subtitle',
//         supportLevel: 'Definitely',
//         volunteerLevel: 'Yes',
//         background: 'default',
//       }),
//       headers: { 'Content-Type': 'application/json' },
//     });
//
//     assert.equal(response.status, 400);
//
//     const { error, field } = await response.json();
//     assert.equal(error, 'validations.nameLength');
//     assert.equal(field, 'firstName');
//   });
//
//   it ('should not create a new page if the last name is missing', async function() {
//     const response = await fetch(`${API_URL}/api/v1/page/test`, {
//       method: 'post',
//       body: JSON.stringify({
//         firstName: 'Ed',
//         email: 'ed@edmarkey.com',
//         phone: '+16175550127',
//         zip: '02129',
//         title: 'Demo page title',
//         subtitle: 'Demo page subtitle',
//         supportLevel: 'Definitely',
//         volunteerLevel: 'Yes',
//         background: 'default',
//       }),
//       headers: { 'Content-Type': 'application/json' },
//     });
//
//     assert.equal(response.status, 400);
//
//     const { error, field } = await response.json();
//     assert.equal(error, 'validations.required');
//     assert.equal(field, 'lastName');
//   });
//
//   it ('should not create a new page if the last name is greater than 50 characters', async function() {
//     const response = await fetch(`${API_URL}/api/v1/page/test`, {
//       method: 'post',
//       body: JSON.stringify({
//         firstName: 'Ed',
//         lastName: 'MarkeyMarkeyMarkeyMarkeyMarkeyMarkeyMarkeyMarkeyMarkeyMarkeyMarkeyMarkeyMarkeyMarkeyMarkeyMarkeyMarkeyMarkeyMarkeyMarkey',
//         email: 'ed@edmarkey.com',
//         phone: '+16175550127',
//         zip: '02129',
//         title: 'Demo page title',
//         subtitle: 'Demo page subtitle',
//         supportLevel: 'Definitely',
//         volunteerLevel: 'Yes',
//         background: 'default',
//       }),
//       headers: { 'Content-Type': 'application/json' },
//     });
//
//     assert.equal(response.status, 400);
//
//     const { error, field } = await response.json();
//     assert.equal(error, 'validations.nameLength');
//     assert.equal(field, 'lastName');
//   });
//
//   it ('should not create a new page if the title is missing', async function() {
//     const response = await fetch(`${API_URL}/api/v1/page/test`, {
//       method: 'post',
//       body: JSON.stringify({
//         firstName: 'Ed',
//         lastName: 'Markey',
//         email: 'ed@edmarkey.com',
//         phone: '+16175550127',
//         zip: '02129',
//         subtitle: 'Demo page subtitle',
//         supportLevel: 'Definitely',
//         volunteerLevel: 'Yes',
//         background: 'default',
//       }),
//       headers: { 'Content-Type': 'application/json' },
//     });
//
//     assert.equal(response.status, 400);
//
//     const { error, field } = await response.json();
//     assert.equal(error, 'validations.required');
//     assert.equal(field, 'title');
//   });
//
//   it ('should not create a new page if the title is greater than 450 characters', async function() {
//     const response = await fetch(`${API_URL}/api/v1/page/test`, {
//       method: 'post',
//       body: JSON.stringify({
//         firstName: 'Ed',
//         lastName: 'Markey',
//         email: 'ed@edmarkey.com',
//         phone: '+16175550127',
//         zip: '02129',
//         title: new Array(451).fill('t').join(''),
//         subtitle: 'Demo page subtitle',
//         supportLevel: 'Definitely',
//         volunteerLevel: 'Yes',
//         background: 'default',
//       }),
//       headers: { 'Content-Type': 'application/json' },
//     });
//
//     assert.equal(response.status, 400);
//
//     const { error, field } = await response.json();
//     assert.equal(error, 'validations.titleLength');
//     assert.equal(field, 'title');
//   });
//
//   it ('should not create a new page if the subtitle is missing', async function() {
//     const response = await fetch(`${API_URL}/api/v1/page/test`, {
//       method: 'post',
//       body: JSON.stringify({
//         firstName: 'Ed',
//         lastName: 'Markey',
//         email: 'ed@edmarkey.com',
//         phone: '+16175550127',
//         zip: '02129',
//         title: 'Demo page title',
//         supportLevel: 'Definitely',
//         volunteerLevel: 'Yes',
//         background: 'default',
//       }),
//       headers: { 'Content-Type': 'application/json' },
//     });
//
//     assert.equal(response.status, 400);
//
//     const { error, field } = await response.json();
//     assert.equal(error, 'validations.required');
//     assert.equal(field, 'subtitle');
//   });
//
//   it ('should not create a new page if the subtitle is greater than 2000 characters', async function() {
//     const response = await fetch(`${API_URL}/api/v1/page/test`, {
//       method: 'post',
//       body: JSON.stringify({
//         firstName: 'Ed',
//         lastName: 'Markey',
//         email: 'ed@edmarkey.com',
//         phone: '+16175550127',
//         zip: '02129',
//         title: 'Demo page title',
//         subtitle: new Array(2001).fill('t').join(''),
//         supportLevel: 'Definitely',
//         volunteerLevel: 'Yes',
//         background: 'default',
//       }),
//       headers: { 'Content-Type': 'application/json' },
//     });
//
//     assert.equal(response.status, 400);
//
//     const { error, field } = await response.json();
//     assert.equal(error, 'validations.subtitleLength');
//     assert.equal(field, 'subtitle');
//   });
//
//   it ('should not create a new page if the code has profanity', async function() {
//     const response = await fetch(`${API_URL}/api/v1/page/fuck`, {
//       method: 'post',
//       body: JSON.stringify({
//         firstName: 'first name',
//         lastName: 'last name',
//         email: 'test@example.com',
//         phone: '+16175550127',
//         zip: '02129',
//         title: 'Demo page title',
//         subtitle: 'Demo page subtitle',
//         supportLevel: 'Definitely',
//         volunteerLevel: 'Yes',
//         background: 'default',
//       }),
//       headers: { 'Content-Type': 'application/json' },
//     });
//
//     assert.equal(response.status, 400);
//
//     const { error, field } = await response.json();
//     assert.equal(error, 'validations.profanity');
//     assert.equal(field, 'code');
//   });
//
//   it ('should not create a new page if the first name has profanity', async function() {
//     const response = await fetch(`${API_URL}/api/v1/page/test`, {
//       method: 'post',
//       body: JSON.stringify({
//         firstName: 'fuck',
//         lastName: 'last name',
//         email: 'test@example.com',
//         phone: '+16175550127',
//         zip: '02129',
//         title: 'Demo page title',
//         subtitle: 'Demo page subtitle',
//         supportLevel: 'Definitely',
//         volunteerLevel: 'Yes',
//         background: 'default',
//       }),
//       headers: { 'Content-Type': 'application/json' },
//     });
//
//     assert.equal(response.status, 400);
//
//     const { error, field } = await response.json();
//     assert.equal(error, 'validations.profanity');
//     assert.equal(field, 'firstName');
//   });
//
//   it ('should not create a new page if the title has profanity', async function() {
//     const response = await fetch(`${API_URL}/api/v1/page/test`, {
//       method: 'post',
//       body: JSON.stringify({
//         firstName: 'first name',
//         lastName: 'last name',
//         email: 'test@example.com',
//         phone: '+16175550127',
//         zip: '02129',
//         title: 'Demo page title fuck',
//         subtitle: 'Demo page subtitle',
//         supportLevel: 'Definitely',
//         volunteerLevel: 'Yes',
//         background: 'default',
//       }),
//       headers: { 'Content-Type': 'application/json' },
//     });
//
//     assert.equal(response.status, 400);
//
//     const { error, field } = await response.json();
//     assert.equal(error, 'validations.profanity');
//     assert.equal(field, 'title');
//   });
//
//   it ('should not create a new page if the subtitle has profanity', async function() {
//     const response = await fetch(`${API_URL}/api/v1/page/test`, {
//       method: 'post',
//       body: JSON.stringify({
//         firstName: 'first name',
//         lastName: 'last name',
//         email: 'test@example.com',
//         phone: '+16175550127',
//         zip: '02129',
//         title: 'Demo page title',
//         subtitle: 'Demo page subtitle fuck',
//         supportLevel: 'Definitely',
//         volunteerLevel: 'Yes',
//         background: 'default',
//       }),
//       headers: { 'Content-Type': 'application/json' },
//     });
//
//     assert.equal(response.status, 400);
//
//     const { error, field } = await response.json();
//     assert.equal(error, 'validations.profanity');
//     assert.equal(field, 'subtitle');
//   });
//
//   it ('should properly format phone numbers', async function() {
//     const responses = await Promise.all([
//       fetch(`${API_URL}/api/v1/page/test1`, {
//         method: 'post',
//         body: JSON.stringify({
//           firstName: 'Ed',
//           lastName: 'Markey',
//           email: 'ed@edmarkey.com',
//           phone: '617 555 0127',
//           zip: '02129',
//           title: 'Demo page title',
//           subtitle: 'Demo page subtitle',
//           supportLevel: 'Definitely',
//           volunteerLevel: 'Yes',
//           background: 'default',
//         }),
//         headers: { 'Content-Type': 'application/json' },
//       }),
//       fetch(`${API_URL}/api/v1/page/test2`, {
//         method: 'post',
//         body: JSON.stringify({
//           firstName: 'Ed',
//           lastName: 'Markey',
//           email: 'ed@edmarkey.com',
//           phone: '(617) 555-0127',
//           zip: '02129',
//           title: 'Demo page title',
//           subtitle: 'Demo page subtitle',
//           supportLevel: 'Definitely',
//           volunteerLevel: 'Yes',
//           background: 'default',
//         }),
//         headers: { 'Content-Type': 'application/json' },
//       }),
//     ]);
//
//     const { error } = await responses[0].json();
//
//     assert.equal(responses[0].status, 200);
//     assert.equal(responses[1].status, 200);
//
//     const client = await MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true });
//     const db = client.db();
//     const pages = db.collection('pages');
//
//     const items = await Promise.all([
//       pages.findOne({ code: 'test1' }),
//       pages.findOne({ code: 'test2' }),
//     ]);
//
//     assert.equal(items[0].createdByPhone, '+16175550127');
//     assert.equal(items[1].createdByPhone, '+16175550127');
//   });
//
//   it ('should not create a new page if the phone is incorrectly formatted', async function() {
//     const response = await fetch(`${API_URL}/api/v1/page/test`, {
//       method: 'post',
//       body: JSON.stringify({
//         firstName: 'Ed',
//         lastName: 'Markey',
//         email: 'ed@edmarkey.com',
//         phone: '617 55 127',
//         zip: '02129',
//         title: 'Demo page title',
//         subtitle: 'Demo page subtitle',
//         supportLevel: 'Definitely',
//         volunteerLevel: 'Yes',
//         background: 'default',
//       }),
//       headers: { 'Content-Type': 'application/json' },
//     });
//
//     assert.equal(response.status, 400);
//
//     const { error, field } = await response.json();
//     assert.equal(error, 'validations.phoneFormat');
//     assert.equal(field, 'phone');
//   });
//
//   it ('should not create a new page if the zip is the wrong length', async function() {
//     const response = await fetch(`${API_URL}/api/v1/page/test`, {
//       method: 'post',
//       body: JSON.stringify({
//         firstName: 'Ed',
//         lastName: 'Markey',
//         email: 'ed@edmarkey.com',
//         phone: '+16175550127',
//         zip: '021',
//         title: 'Demo page title',
//         subtitle: 'Demo page subtitle',
//         supportLevel: 'Definitely',
//         volunteerLevel: 'Yes',
//         background: 'default',
//       }),
//       headers: { 'Content-Type': 'application/json' },
//     });
//
//     assert.equal(response.status, 400);
//
//     const { error, field } = await response.json();
//     assert.equal(error, 'validations.zipFormat');
//     assert.equal(field, 'zip');
//   });
//
//   it ('should not create a new page if the zip is not a number', async function() {
//     const response = await fetch(`${API_URL}/api/v1/page/test`, {
//       method: 'post',
//       body: JSON.stringify({
//         firstName: 'Ed',
//         lastName: 'Markey',
//         email: 'ed@edmarkey.com',
//         phone: '+16175550127',
//         zip: '0212b',
//         title: 'Demo page title',
//         subtitle: 'Demo page subtitle',
//         supportLevel: 'Definitely',
//         volunteerLevel: 'Yes',
//         background: 'default',
//       }),
//       headers: { 'Content-Type': 'application/json' },
//     });
//
//     assert.equal(response.status, 400);
//
//     const { error, field } = await response.json();
//     assert.equal(error, 'validations.zipFormat');
//     assert.equal(field, 'zip');
//   });
//
//   it ('should not create a new page if the background key is invalid', async function() {
//     const response = await fetch(`${API_URL}/api/v1/page/test`, {
//       method: 'post',
//       body: JSON.stringify({
//         firstName: 'Ed',
//         lastName: 'Markey',
//         email: 'ed@edmarkey.com',
//         phone: '+16175550127',
//         zip: '02129',
//         title: 'Demo page title',
//         subtitle: 'Demo page subtitle',
//         supportLevel: 'Definitely',
//         volunteerLevel: 'Yes',
//         background: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Joe_Kennedy_III%2C_official_portrait%2C_116th_Congress.jpg/220px-Joe_Kennedy_III%2C_official_portrait%2C_116th_Congress.jpg',
//       }),
//       headers: { 'Content-Type': 'application/json' },
//     });
//
//     assert.equal(response.status, 400);
//
//     const { error, field } = await response.json();
//     assert.equal(error, 'validations.required');
//     assert.equal(field, 'background');
//   });
//
//   it ('should cut out script tags', async function () {
//     const response = await fetch(`${API_URL}/api/v1/page/test`, {
//       method: 'post',
//       body: JSON.stringify({
//         firstName: '<script>console.log("Ed")</script>',
//         lastName: 'Markey',
//         email: 'ed@edmarkey.com',
//         phone: '+16175550127',
//         zip: '02129',
//         title: '<script>console.log("Demo page title")</script>',
//         subtitle: '<script>console.log("Demo page subtitle")</script>',
//         supportLevel: 'Definitely',
//         volunteerLevel: 'Yes',
//         background: 'default',
//       }),
//       headers: { 'Content-Type': 'application/json' },
//     });
//
//     assert.equal(response.status, 200);
//
//     const { page } = await response.json();
//
//     assert.equal(page.createdByFirstName, '&lt;script&gt;console.log("Ed")&lt;/script&gt;');
//     assert.equal(page.title, '&lt;script&gt;console.log("Demo page title")&lt;/script&gt;');
//     assert.equal(page.subtitle, '&lt;script&gt;console.log("Demo page subtitle")&lt;/script&gt;');
//   });
// });
//
// describe('page signup api v1', function() {
//   it ('should make a new signup with valid fields', async function() {
//     const client = await MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true });
//     const db = client.db();
//     const pages = db.collection('pages');
//
//     await pages.insertOne({ code: 'test', totalSignups: 0 });
//
//     const response = await fetch(`${API_URL}/api/v1/page/test/signup/1`, {
//       method: 'post',
//       body: JSON.stringify({
//         firstName: 'Ed',
//         lastName: 'Markey',
//         email: 'ed@edmarkey.com',
//         phone: '+16175550127',
//         zip: '02129',
//       }),
//       headers: { 'Content-Type': 'application/json' },
//     });
//
//     assert.equal(response.status, 200);
//
//     const { ok } = await response.json();
//     assert.isTrue(ok);
//
//     const page = await pages.findOne({ code: 'test' });
//     assert.equal(page.totalSignups, 1);
//   });
//
//   it ('should make a new signup with valid fields and uppercase code', async function() {
//     const client = await MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true });
//     const db = client.db();
//     const pages = db.collection('pages');
//
//     await pages.insertOne({ code: 'test', totalSignups: 0 });
//
//     const response = await fetch(`${API_URL}/api/v1/page/TEST/signup/1`, {
//       method: 'post',
//       body: JSON.stringify({
//         firstName: 'Ed',
//         lastName: 'Markey',
//         email: 'ed@edmarkey.com',
//         phone: '+16175550127',
//         zip: '02129',
//       }),
//       headers: { 'Content-Type': 'application/json' },
//     });
//
//     assert.equal(response.status, 200);
//
//     const { ok } = await response.json();
//     assert.isTrue(ok);
//
//     const page = await pages.findOne({ code: 'test' });
//     assert.equal(page.totalSignups, 1);
//   });
//
//   it ('should not signup for a non-existent signup page', async function() {
//     const response = await fetch(`${API_URL}/api/v1/page/test/signup/1`, {
//       method: 'post',
//       body: JSON.stringify({
//         firstName: 'Ed',
//         lastName: 'Markey',
//         email: 'ed@edmarkey.com',
//         phone: '+16175550127',
//         zip: '02129',
//       }),
//       headers: { 'Content-Type': 'application/json' },
//     });
//
//     assert.equal(response.status, 404);
//
//     const { error } = await response.json();
//     assert.isString(error);
//   });
//
//   it ('should not create a new signup if the first name is missing', async function() {
//     const client = await MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true });
//     const db = client.db();
//     const pages = db.collection('pages');
//
//     await pages.insertOne({ code: 'test', totalSignups: 0 });
//
//     const response = await fetch(`${API_URL}/api/v1/page/test/signup/1`, {
//       method: 'post',
//       body: JSON.stringify({
//         lastName: 'Markey',
//         email: 'ed@edmarkey.com',
//         phone: '+16175550127',
//         zip: '02129',
//       }),
//       headers: { 'Content-Type': 'application/json' },
//     });
//
//     assert.equal(response.status, 400);
//
//     const { error, field } = await response.json();
//     assert.equal(error, 'validations.required');
//     assert.equal(field, 'firstName');
//   });
//
//   it ('should not create a new signup if the last name is missing', async function() {
//     const client = await MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true });
//     const db = client.db();
//     const pages = db.collection('pages');
//
//     await pages.insertOne({ code: 'test', totalSignups: 0 });
//
//     const response = await fetch(`${API_URL}/api/v1/page/test/signup/1`, {
//       method: 'post',
//       body: JSON.stringify({
//         firstName: 'Ed',
//         email: 'ed@edmarkey.com',
//         phone: '+16175550127',
//         zip: '02129',
//       }),
//       headers: { 'Content-Type': 'application/json' },
//     });
//
//     assert.equal(response.status, 400);
//
//     const { error, field } = await response.json();
//     assert.equal(error, 'validations.required');
//     assert.equal(field, 'lastName');
//   });
//
//   it ('should not create a new signup if the zip is missing', async function() {
//     const client = await MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true });
//     const db = client.db();
//     const pages = db.collection('pages');
//
//     await pages.insertOne({ code: 'test', totalSignups: 0 });
//
//     const response = await fetch(`${API_URL}/api/v1/page/test/signup/1`, {
//       method: 'post',
//       body: JSON.stringify({
//         firstName: 'Ed',
//         lastName: 'Markey',
//         email: 'ed@edmarkey.com',
//         phone: '+16175550127',
//       }),
//       headers: { 'Content-Type': 'application/json' },
//     });
//
//     assert.equal(response.status, 400);
//
//     const { error, field } = await response.json();
//     assert.equal(error, 'validations.required');
//     assert.equal(field, 'zip');
//   });
//
//   it ('should not create a new signup if the zip is incorrectly formatted', async function() {
//     const client = await MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true });
//     const db = client.db();
//     const pages = db.collection('pages');
//
//     await pages.insertOne({ code: 'test', totalSignups: 0 });
//
//     const response = await fetch(`${API_URL}/api/v1/page/test/signup/1`, {
//       method: 'post',
//       body: JSON.stringify({
//         firstName: 'Ed',
//         lastName: 'Markey',
//         email: 'ed@edmarkey.com',
//         phone: '+16175550127',
//         zip: '021',
//       }),
//       headers: { 'Content-Type': 'application/json' },
//     });
//
//     assert.equal(response.status, 400);
//
//     const { error, field } = await response.json();
//     assert.equal(error, 'validations.zipFormat');
//     assert.equal(field, 'zip');
//   });
//
//   it ('should not create a new signup if the phone is missing', async function() {
//     const client = await MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true });
//     const db = client.db();
//     const pages = db.collection('pages');
//
//     await pages.insertOne({ code: 'test', totalSignups: 0 });
//
//     const response = await fetch(`${API_URL}/api/v1/page/test/signup/1`, {
//       method: 'post',
//       body: JSON.stringify({
//         firstName: 'Ed',
//         lastName: 'Markey',
//         email: 'ed@edmarkey.com',
//         zip: '02129',
//       }),
//       headers: { 'Content-Type': 'application/json' },
//     });
//
//     assert.equal(response.status, 400);
//
//     const { error, field } = await response.json();
//     assert.equal(error, 'validations.required');
//     assert.equal(field, 'phone');
//   });
//
//   it ('should not create a new signup if the phone is incorrectly formatted', async function() {
//     const client = await MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true });
//     const db = client.db();
//     const pages = db.collection('pages');
//
//     await pages.insertOne({ code: 'test', totalSignups: 0 });
//
//     const response = await fetch(`${API_URL}/api/v1/page/test/signup/1`, {
//       method: 'post',
//       body: JSON.stringify({
//         firstName: 'Ed',
//         lastName: 'Markey',
//         email: 'ed@edmarkey.com',
//         phone: '617 55 127',
//         zip: '02129',
//       }),
//       headers: { 'Content-Type': 'application/json' },
//     });
//
//     assert.equal(response.status, 400);
//
//     const { error, field } = await response.json();
//     assert.equal(error, 'validations.phoneFormat');
//     assert.equal(field, 'phone');
//   });
// });
