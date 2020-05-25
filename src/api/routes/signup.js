const { ObjectId } = require('mongodb');
const getPageForCode = require('../db/getPageForCode');
const sendMail = require('../services/sendMail');
const submitBsdForm = require('../services/submitBsdForm');
const apiErrorHandler = require('../utils/apiErrorHandler');
const validateAndNormalizeApiRequestFields = require('../utils/validateAndNormalizeApiRequestFields');

const EMAIL_FREQUENCY = require('../../shared/emailFrequency');
const BSD_VAN_MAP = require('../utils/markeyVanFields');

const {
  BSD_SIGNUP_CODE_ID,
  BSD_SIGNUP_SUPPORT_ID,
  BSD_SIGNUP_VOLUNTEER_ID,
} = process.env;

module.exports = ({ db }) => {
  async function signup(req, res) {
    try {
      const {
        campaign,
        body: {
          code,
          firstName,
          lastName,
          email,
          phone,
          zip,
          supportLevel,
          volunteerLevel,
        },
      } = req;

      const inputs = {
        code,
        firstName,
        lastName,
        phone,
        zip,
        supportLevel,
        volunteerLevel,
      };

      const validationRequirements = {
        email,
      };

      Object.keys(inputs)
        .filter((key) => typeof inputs[key] !== 'undefined')
        .forEach((key) => validationRequirements[key] = inputs[key]);

      const validationResult = validateAndNormalizeApiRequestFields(validationRequirements);

      if (Array.isArray(validationResult)) {
        res.status(400).json({
          field: validationResult[0],
          error: validationResult[1],
        });

        return;
      }

      const signup = {
        ...validationResult,
        campaign: campaign._id.toString(),
        recruitedBy: null,
        type: 'subscriber',
        lastUpdatedAt: Date.now(),
      };

      if (validationResult.code) {
        const pageMatch = await getPageForCode(
          db,
          campaign._id.toString(),
          validationResult.code,
        );

        if (pageMatch instanceof Error) {
          throw pageMatch;
        }

        if (!pageMatch) {
          res.status(400).json({ error: 'Signup specified code that does not exist' });
          return;
        }

        signup.recruitedBy = pageMatch.createdBy;

        const pageAuthor = await db.collection('users')
          .findOne({ _id: ObjectId(pageMatch.createdBy) });

        if (pageAuthor && pageAuthor.emailFrequency === EMAIL_FREQUENCY.TRANSACTIONAL_EMAIL) {
          const mailResult = await sendMail(
            pageAuthor.email,
            process.env.SENDGRID_TEMPLATE_TRANSACTIONAL_SIGNUP,
            {
              signupFirstName: signup.firstName,
              signupLastName: signup.lastName,
              campaignName: campaign.name,
              domain: campaign.domains.pop(),
            },
          );

          if (mailResult instanceof Error) {
            throw mailResult;
          }
        }
      }

      const bsdResult = await submitBsdForm({
        email: signup.email,
        firstname: signup.firstName,
        lastname: signup.lastName,
        phone: signup.phone,
        zip: signup.zip,
        [BSD_SIGNUP_CODE_ID]: signup.code,
        [BSD_SIGNUP_SUPPORT_ID]: BSD_VAN_MAP.support[signup.supportLevel],
        [BSD_SIGNUP_VOLUNTEER_ID]: BSD_VAN_MAP.volunteer[signup.volunteerLevel],
      });

      if (bsdResult instanceof Error) {
        throw bsdResult;
      }

      const signups = db.collection('signups');

      await signups.updateOne(
        {
          email: signup.email,
          recruitedBy: signup.recruitedBy,
          campaign: signup.campaign,
        },
        { '$set': signup },
        { upsert: true },
      );

      res.json({ ok: true });
    } catch (error) {
      apiErrorHandler(res, error);
    }
  }

  return signup;
}
