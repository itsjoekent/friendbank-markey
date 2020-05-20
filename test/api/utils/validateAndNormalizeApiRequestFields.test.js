const chai = require('chai');
const validateAndNormalizeApiRequestFields = require('../../../src/api/utils/validateAndNormalizeApiRequestFields');

// Reference: https://www.chaijs.com/api/assert/
const assert = chai.assert;

describe('validateAndNormalizeApiRequestFields utility', function() {
  it('should return an error even if multiple fields are present', function() {
    assert.deepEqual(
      ['firstName', 'validations.required'],
      validateAndNormalizeApiRequestFields({
        lastName: 'Markey',
        firstName: '',
      }),
    );
  });

  it('should validate the first name field', function() {
    assert.deepEqual(
      ['firstName', 'validations.required'],
      validateAndNormalizeApiRequestFields({
        firstName: '',
      }),
    );

    assert.deepEqual(
      ['firstName', 'validations.required'],
      validateAndNormalizeApiRequestFields({
        firstName: null,
      }),
    );

    assert.deepEqual(
      ['firstName', 'validations.required'],
      validateAndNormalizeApiRequestFields({
        firstName: undefined,
      }),
    );

    assert.deepEqual(
      ['firstName', 'validations.nameLength'],
      validateAndNormalizeApiRequestFields({
        firstName: new Array(51).fill('f').join(''),
      }),
    );

    assert.deepEqual(
      { firstName: 'Ed' },
      validateAndNormalizeApiRequestFields({
        firstName: 'Ed',
      }),
    );

    assert.deepEqual(
      { firstName: '&lt;script&gt;console.log("Ed")&lt;/script&gt;' },
      validateAndNormalizeApiRequestFields({
        firstName: '<script>console.log("Ed")</script>',
      }),
    );
  });

  it('should validate the last name field', function() {
    assert.deepEqual(
      ['lastName', 'validations.required'],
      validateAndNormalizeApiRequestFields({
        lastName: '',
      }),
    );

    assert.deepEqual(
      ['lastName', 'validations.required'],
      validateAndNormalizeApiRequestFields({
        lastName: null,
      }),
    );

    assert.deepEqual(
      ['lastName', 'validations.required'],
      validateAndNormalizeApiRequestFields({
        lastName: undefined,
      }),
    );

    assert.deepEqual(
      ['lastName', 'validations.nameLength'],
      validateAndNormalizeApiRequestFields({
        lastName: new Array(51).fill('f').join(''),
      }),
    );

    assert.deepEqual(
      { lastName: 'Markey' },
      validateAndNormalizeApiRequestFields({
        lastName: 'Markey',
      }),
    );
  });

  it('should validate the zip field', function() {
    assert.deepEqual(
      ['zip', 'validations.required'],
      validateAndNormalizeApiRequestFields({
        zip: '',
      }),
    );

    assert.deepEqual(
      ['zip', 'validations.required'],
      validateAndNormalizeApiRequestFields({
        zip: null,
      }),
    );

    assert.deepEqual(
      ['zip', 'validations.required'],
      validateAndNormalizeApiRequestFields({
        zip: undefined,
      }),
    );

    assert.deepEqual(
      ['zip', 'validations.zipFormat'],
      validateAndNormalizeApiRequestFields({
        zip: '0123456',
      }),
    );

    assert.deepEqual(
      ['zip', 'validations.zipFormat'],
      validateAndNormalizeApiRequestFields({
        zip: 'ABC12',
      }),
    );

    assert.deepEqual(
      { zip: '00000' },
      validateAndNormalizeApiRequestFields({
        zip: '00000',
      }),
    );

    assert.deepEqual(
      { zip: '11111' },
      validateAndNormalizeApiRequestFields({
        zip: 11111,
      }),
    );
  });

  it('should validate the phone field', function() {
    assert.deepEqual(
      ['phone', 'validations.required'],
      validateAndNormalizeApiRequestFields({
        phone: '',
      }),
    );

    assert.deepEqual(
      ['phone', 'validations.required'],
      validateAndNormalizeApiRequestFields({
        phone: null,
      }),
    );

    assert.deepEqual(
      ['phone', 'validations.required'],
      validateAndNormalizeApiRequestFields({
        phone: undefined,
      }),
    );

    assert.deepEqual(
      ['phone', 'validations.phoneFormat'],
      validateAndNormalizeApiRequestFields({
        phone: '111',
      }),
    );

    assert.deepEqual(
      ['phone', 'validations.phoneFormat'],
      validateAndNormalizeApiRequestFields({
        phone: 'ABC DEF GHIJ',
      }),
    );

    assert.deepEqual(
      ['phone', 'validations.phoneFormat'],
      validateAndNormalizeApiRequestFields({
        phone: '111 22 3344',
      }),
    );

    assert.deepEqual(
      { phone: '+11112223344' },
      validateAndNormalizeApiRequestFields({
        phone: '111 222 3344',
      }),
    );

    assert.deepEqual(
      { phone: '+11112223344' },
      validateAndNormalizeApiRequestFields({
        phone: '1112223344',
      }),
    );
  });

  it('should validate the email field', function() {
    assert.deepEqual(
      ['email', 'validations.required'],
      validateAndNormalizeApiRequestFields({
        email: '',
      }),
    );

    assert.deepEqual(
      ['email', 'validations.required'],
      validateAndNormalizeApiRequestFields({
        email: null,
      }),
    );

    assert.deepEqual(
      ['email', 'validations.required'],
      validateAndNormalizeApiRequestFields({
        email: undefined,
      }),
    );

    assert.deepEqual(
      ['email', 'validations.emailFormat'],
      validateAndNormalizeApiRequestFields({
        email: 'test.com',
      }),
    );

    assert.deepEqual(
      ['email', 'validations.emailFormat'],
      validateAndNormalizeApiRequestFields({
        email: 'test@.com',
      }),
    );

    assert.deepEqual(
      { email: 'ed@edmarkey.com' },
      validateAndNormalizeApiRequestFields({
        email: 'ed@edmarkey.com'
      }),
    );
  });

  it('should validate the code field', function() {
    assert.deepEqual(
      ['code', 'validations.required'],
      validateAndNormalizeApiRequestFields({
        code: '',
      }),
    );

    assert.deepEqual(
      ['code', 'validations.required'],
      validateAndNormalizeApiRequestFields({
        code: null,
      }),
    );

    assert.deepEqual(
      ['code', 'validations.required'],
      validateAndNormalizeApiRequestFields({
        code: undefined,
      }),
    );

    assert.deepEqual(
      ['code', 'validations.codeLength'],
      validateAndNormalizeApiRequestFields({
        code: new Array(51).fill('f').join(''),
      }),
    );

    assert.deepEqual(
      ['code', 'validations.codeFormat'],
      validateAndNormalizeApiRequestFields({
        code: 'test$',
      }),
    );

    assert.deepEqual(
      { code: 'test' },
      validateAndNormalizeApiRequestFields({
        code: 'TEST',
      }),
    );
  });

  it('should validate the title field', function() {
    assert.deepEqual(
      ['title', 'validations.required'],
      validateAndNormalizeApiRequestFields({
        title: '',
      }),
    );

    assert.deepEqual(
      ['title', 'validations.required'],
      validateAndNormalizeApiRequestFields({
        title: null,
      }),
    );

    assert.deepEqual(
      ['title', 'validations.required'],
      validateAndNormalizeApiRequestFields({
        title: undefined,
      }),
    );

    assert.deepEqual(
      ['title', 'validations.titleLength'],
      validateAndNormalizeApiRequestFields({
        title: new Array(451).fill('f').join(''),
      }),
    );

    assert.deepEqual(
      ['title', 'validations.profanity'],
      validateAndNormalizeApiRequestFields({
        title: 'fuck',
      }),
    );

    assert.deepEqual(
      { title: 'The title' },
      validateAndNormalizeApiRequestFields({
        title: 'The title',
      }),
    );

    assert.deepEqual(
      { title: 'The title' },
      validateAndNormalizeApiRequestFields({
        title: 'The title          ',
      }),
    );

    assert.deepEqual(
      { title: '&lt;script&gt;console.log("Demo page title")&lt;/script&gt;' },
      validateAndNormalizeApiRequestFields({
        title: '<script>console.log("Demo page title")</script>',
      }),
    );
  });

  it('should validate the subtitle field', function() {
    assert.deepEqual(
      ['subtitle', 'validations.required'],
      validateAndNormalizeApiRequestFields({
        subtitle: '',
      }),
    );

    assert.deepEqual(
      ['subtitle', 'validations.required'],
      validateAndNormalizeApiRequestFields({
        subtitle: null,
      }),
    );

    assert.deepEqual(
      ['subtitle', 'validations.required'],
      validateAndNormalizeApiRequestFields({
        subtitle: undefined,
      }),
    );

    assert.deepEqual(
      ['subtitle', 'validations.subtitleLength'],
      validateAndNormalizeApiRequestFields({
        subtitle: new Array(2001).fill('f').join(''),
      }),
    );

    assert.deepEqual(
      ['subtitle', 'validations.profanity'],
      validateAndNormalizeApiRequestFields({
        subtitle: 'fuck',
      }),
    );

    assert.deepEqual(
      { subtitle: 'The subtitle' },
      validateAndNormalizeApiRequestFields({
        subtitle: 'The subtitle',
      }),
    );

    assert.deepEqual(
      { subtitle: 'The subtitle' },
      validateAndNormalizeApiRequestFields({
        subtitle: 'The subtitle       ',
      }),
    );

    assert.deepEqual(
      { subtitle: '&lt;script&gt;console.log("Demo page subtitle")&lt;/script&gt;' },
      validateAndNormalizeApiRequestFields({
        subtitle: '<script>console.log("Demo page subtitle")</script>',
      }),
    );
  });

  it('should validate the supportLevel field', function() {
    assert.deepEqual(
      ['supportLevel', 'validations.required'],
      validateAndNormalizeApiRequestFields({
        supportLevel: '',
      }),
    );

    assert.deepEqual(
      ['supportLevel', 'validations.required'],
      validateAndNormalizeApiRequestFields({
        supportLevel: null,
      }),
    );

    assert.deepEqual(
      ['supportLevel', 'validations.required'],
      validateAndNormalizeApiRequestFields({
        supportLevel: undefined,
      }),
    );

    assert.deepEqual(
      { supportLevel: 'value' },
      validateAndNormalizeApiRequestFields({
        supportLevel: 'value',
      }),
    );
  });

  it('should validate the volunteerLevel field', function() {
    assert.deepEqual(
      ['volunteerLevel', 'validations.required'],
      validateAndNormalizeApiRequestFields({
        volunteerLevel: '',
      }),
    );

    assert.deepEqual(
      ['volunteerLevel', 'validations.required'],
      validateAndNormalizeApiRequestFields({
        volunteerLevel: null,
      }),
    );

    assert.deepEqual(
      ['volunteerLevel', 'validations.required'],
      validateAndNormalizeApiRequestFields({
        volunteerLevel: undefined,
      }),
    );

    assert.deepEqual(
      { volunteerLevel: 'value' },
      validateAndNormalizeApiRequestFields({
        volunteerLevel: 'value',
      }),
    );
  });

  it('should validate the background field', function() {
    assert.deepEqual(
      ['background', 'validations.required'],
      validateAndNormalizeApiRequestFields({
        background: '',
      }),
    );

    assert.deepEqual(
      ['background', 'validations.required'],
      validateAndNormalizeApiRequestFields({
        background: null,
      }),
    );

    assert.deepEqual(
      ['background', 'validations.required'],
      validateAndNormalizeApiRequestFields({
        background: undefined,
      }),
    );

    assert.deepEqual(
      ['background', 'validations.required'],
      validateAndNormalizeApiRequestFields({
        background: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Joe_Kennedy_III%2C_official_portrait%2C_116th_Congress.jpg/220px-Joe_Kennedy_III%2C_official_portrait%2C_116th_Congress.jpg',
      }),
    );

    assert.deepEqual(
      { background: 'default' },
      validateAndNormalizeApiRequestFields({
        background: 'default',
      }),
    );
  });

  it('should validate the emailFrequency field', function() {
    assert.deepEqual(
      ['emailFrequency', 'validations.required'],
      validateAndNormalizeApiRequestFields({
        emailFrequency: '',
      }),
    );

    assert.deepEqual(
      ['emailFrequency', 'validations.required'],
      validateAndNormalizeApiRequestFields({
        emailFrequency: null,
      }),
    );

    assert.deepEqual(
      ['emailFrequency', 'validations.required'],
      validateAndNormalizeApiRequestFields({
        emailFrequency: undefined,
      }),
    );

    assert.deepEqual(
      ['emailFrequency', 'validations.required'],
      validateAndNormalizeApiRequestFields({
        emailFrequency: 'luv 2 email',
      }),
    );

    assert.deepEqual(
      { emailFrequency: 'UNSUBSCRIBED' },
      validateAndNormalizeApiRequestFields({
        emailFrequency: 'UNSUBSCRIBED',
      }),
    );
  });

  it('should validate the password field', function() {
    assert.deepEqual(
      ['password', 'validations.required'],
      validateAndNormalizeApiRequestFields({
        password: '',
      }),
    );

    assert.deepEqual(
      ['password', 'validations.required'],
      validateAndNormalizeApiRequestFields({
        password: null,
      }),
    );

    assert.deepEqual(
      ['password', 'validations.required'],
      validateAndNormalizeApiRequestFields({
        password: undefined,
      }),
    );

    assert.deepEqual(
      ['password', 'validations.passwordLength'],
      validateAndNormalizeApiRequestFields({
        password: '1',
      }),
    );

    assert.deepEqual(
      { password: 'password' },
      validateAndNormalizeApiRequestFields({
        password: 'password',
      }),
    );
  });
});
