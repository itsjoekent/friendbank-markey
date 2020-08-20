const BSD_VAN_MAP = require('./markeyVanFields');

const {
  BSD_SIGNUP_SUPPORT_ID,
  BSD_SIGNUP_VOLUNTEER_ID,
  BSD_SIGNUP_BALLOT_ID,
  BSD_SIGNUP_VOTE_ID,
  BSD_SIGNUP_ACTIONS_ID,
  BSD_SIGNUP_NOTE_ID,

  BSD_CONTACT_SUPPORT_ID,
  BSD_CONTACT_VOLUNTEER_ID,
  BSD_CONTACT_BALLOT_ID,
  BSD_CONTACT_VOTE_ID,
  BSD_CONTACT_ACTIONS_ID,
  BSD_CONTACT_NOTE_ID,

  BSD_SIGNUP_FORM_SLUG,
  BSD_CONTACT_FORM_SLUG,
} = process.env;

const SUPPORT_ID = 'SUPPORT_ID';
const VOLUNTEER_ID = 'VOLUNTEER_ID';
const BALLOT_ID = 'BALLOT_ID';
const VOTE_ID = 'VOTE_ID';
const ACTIONS_ID = 'ACTIONS_ID';
const NOTE_ID = 'NOTE_ID';

const FIELD_MAP = {
  [BSD_SIGNUP_FORM_SLUG]: {
    [SUPPORT_ID]: BSD_SIGNUP_SUPPORT_ID,
    [VOLUNTEER_ID]: BSD_SIGNUP_VOLUNTEER_ID,
    [BALLOT_ID]: BSD_SIGNUP_BALLOT_ID,
    [VOTE_ID]: BSD_SIGNUP_VOTE_ID,
    [ACTIONS_ID]: BSD_SIGNUP_ACTIONS_ID,
    [NOTE_ID]: BSD_SIGNUP_NOTE_ID,
  },
  [BSD_CONTACT_FORM_SLUG]: {
    [SUPPORT_ID]: BSD_CONTACT_SUPPORT_ID,
    [VOLUNTEER_ID]: BSD_CONTACT_VOLUNTEER_ID,
    [BALLOT_ID]: BSD_CONTACT_BALLOT_ID,
    [VOTE_ID]: BSD_CONTACT_VOTE_ID,
    [ACTIONS_ID]: BSD_CONTACT_ACTIONS_ID,
    [NOTE_ID]: BSD_CONTACT_NOTE_ID,
  },
};

module.exports = function constructBsdSignupPayload(signup, formSlug) {
  const bsdPayload = {
    email: signup.email || '',
    firstname: signup.firstName,
    lastname: signup.lastName,
    phone: signup.phone,
    zip: signup.zip,
  };

  if (signup.supportLevel) {
    bsdPayload[FIELD_MAP[formSlug][SUPPORT_ID]] = BSD_VAN_MAP.support[signup.supportLevel];
  }

  if (signup.volunteerLevel) {
    bsdPayload[FIELD_MAP[formSlug][VOLUNTEER_ID]] = BSD_VAN_MAP.volunteer[signup.volunteerLevel];
  }

  if (signup.ballotStatus) {
    bsdPayload[FIELD_MAP[formSlug][BALLOT_ID]] = signup.ballotStatus;
  }

  if (signup.voteStatus) {
    bsdPayload[FIELD_MAP[formSlug][VOTE_ID]] = BSD_VAN_MAP.volunteer[signup.voteStatus];
  }

  if (signup.actions) {
    bsdPayload[FIELD_MAP[formSlug][ACTIONS_ID]] = signup.actions;
  }

  if (signup.note) {
    bsdPayload[FIELD_MAP[formSlug][NOTE_ID]] = signup.note;
  }

  return bsdPayload;
}
