const { ObjectId } = require('mongodb');
const submitBsdForm = require('../services/submitBsdForm');
const constructBsdSignupPayload = require('../utils/constructBsdSignupPayload');
const apiErrorHandler = require('../utils/apiErrorHandler');
const validateAndNormalizeApiRequestFields = require('../utils/validateAndNormalizeApiRequestFields');
const fieldValidations = require('../../shared/fieldValidations');
const { STAFF_ROLE } = require('../../shared/roles');

const {
  BSD_CONTACT_FRIEND_ID,
  BSD_CONTACT_FORM_SLUG,
  BSD_SIGNUP_FORM_SLUG,
} = process.env;

module.exports = ({ db }) => {
  async function editSignup(req, res) {
    try {
      const {
        campaign,
        token,
        params: {
          id,
        },
        body: {
          firstName,
          lastName,
          email,
          phone,
          zip,
          supportLevel,
          volunteerLevel,
          ballotStatus,
          actions,
          note,
        },
      } = req;

      const inputs = {
        email,
        firstName,
        lastName,
        phone,
        zip,
        supportLevel,
        volunteerLevel,
        ballotStatus,
        actions,
        note,
      };

      const validationRequirements = {};

      Object.keys(inputs)
        .filter((key) => typeof inputs[key] !== 'undefined')
        .forEach((key) => validationRequirements[key] = inputs[key]);

      const validationResult = validateAndNormalizeApiRequestFields(
        validationRequirements,
        {
          zip: [fieldValidations.validateZipNotRequired],
          phone: [fieldValidations.validatePhoneNotRequired],
        },
      );

      if (Array.isArray(validationResult)) {
        res.status(400).json({
          field: validationResult[0],
          error: validationResult[1],
        });

        return;
      }

      const signups = db.collection('signups');
      const signup = await signups.findOne({ _id: ObjectId(id) });

      if (!signup) {
        res.status(404).json({ error: 'This signup does not exist' });
        return;
      }

      if (
        token.user.role !== STAFF_ROLE
        && signup.recruitedBy !== token.user._id.toString()
      ) {
        res.status(401).json({ error: 'You do not have permissions to edit this signup' });
        return;
      }

      if (signup.campaign !== campaign._id.toString()) {
        res.status(401).json({ error: 'You do not have permissions to edit this signup' });
        return;
      }

      const update = {
        ...validationResult,
        lastUpdatedAt: Date.now(),
      };

      let bsdPayload = null;
      let targetFormSlug = null;

      if (signup.type === 'contact') {
        targetFormSlug = BSD_CONTACT_FORM_SLUG;

        bsdPayload = constructBsdSignupPayload({ ...signup, ...update }, targetFormSlug);
        bsdPayload[BSD_CONTACT_FRIEND_ID] = token.user.email;
      } else if (signup.type === 'subscriber') {
        targetFormSlug = BSD_SIGNUP_FORM_SLUG;
        bsdPayload = constructBsdSignupPayload({ ...signup, ...update }, targetFormSlug);
      }

      if (bsdPayload && targetFormSlug) {
        const bsdResult = await submitBsdForm(targetFormSlug, bsdPayload);

        if (bsdResult instanceof Error) {
          throw bsdResult;
        }
      }

      await signups.updateOne(
        { _id: ObjectId(id) },
        { '$set': update },
      );

      res.json({ ok: true });
    } catch (error) {
      apiErrorHandler(res, error);
    }
  }

  return editSignup;
}
