const { ObjectId } = require('mongodb');
const getPageForCode = require('../db/getPageForCode');
const apiErrorHandler = require('../utils/apiErrorHandler');
const validateAndNormalizeApiRequestFields = require('../utils/validateAndNormalizeApiRequestFields');

module.exports = ({ db }) => {
  async function contact(req, res) {
    try {
      const {
        token,
        campaign,
        body: {
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
        recruitedBy: token.user._id.toString(),
        type: 'contact',
        lastUpdatedAt: Date.now(),
      };

      const signups = db.collection('signups');

      await signups.updateOne(
        {
          email: signup.email,
          recruitedBy: signup.recruitedBy,
          campaign: campaign._id.toString(),
        },
        { '$set': signup },
        { upsert: true },
      );

      res.json({ ok: true });
    } catch (error) {
      apiErrorHandler(res, error);
    }
  }

  return contact;
}
