const { ObjectId } = require('mongodb');
const getPageForCode = require('../db/getPageForCode');
const sendMail = require('../services/sendMail');
const submitBsdForm = require('../services/submitBsdForm');
const constructBsdSignupPayload = require('../utils/constructBsdSignupPayload');
const apiErrorHandler = require('../utils/apiErrorHandler');
const validateAndNormalizeApiRequestFields = require('../utils/validateAndNormalizeApiRequestFields');

const EMAIL_FREQUENCY = require('../../shared/emailFrequency');
const BSD_VAN_MAP = require('../utils/markeyVanFields');

const {
  BSD_SIGNUP_CODE_ID,
  BSD_SIGNUP_FORM_SLUG,
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
          ballotStatus,
          voteStatus,
          actions,
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
        ballotStatus,
        voteStatus,
        actions,
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

        if (
          pageAuthor
          && pageAuthor.emailFrequency === EMAIL_FREQUENCY.TRANSACTIONAL_EMAIL
          && (!validationResult.supportLevel && !validationResult.volunteerLevel)
        ) {
          const domain = campaign.domains.pop();
          const shareLink = `https://${domain}/${pageMatch.code}`;

          const facebookLink = `https://www.facebook.com/sharer/sharer.php?u=${shareLink}&quote=${encodeURIComponent(pageMatch.title)}`;
          const twitterLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${pageMatch.title}\n${shareLink}`)}`;

          const mailResult = await sendMail(
            pageAuthor.email,
            process.env.MAIL_SIGNUP_ID,
            {
              authorFirstName: pageAuthor.firstName,
              signupFirstName: signup.firstName,
              signupLastName: signup.lastName,
              shareCode: pageMatch.code,
              campaignName: campaign.name,
              facebookLink,
              twitterLink,
              domain,
            },
          );

          if (mailResult instanceof Error) {
            throw mailResult;
          }
        }
      }

      const bsdPayload = constructBsdSignupPayload(signup, BSD_SIGNUP_FORM_SLUG);

      if (signup.code) {
        bsdPayload[BSD_SIGNUP_CODE_ID] = signup.code;
      }

      const bsdResult = await submitBsdForm(BSD_SIGNUP_FORM_SLUG, bsdPayload);

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
