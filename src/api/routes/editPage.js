const getPageForCode = require('../db/getPageForCode');
const getToken = require('../db/getToken');
const validateBackgroundField = require('../utils/validateBackgroundField');
const validateAndNormalizeApiRequestFields = require('../utils/validateAndNormalizeApiRequestFields');
const apiErrorHandler = require('../utils/apiErrorHandler');
const normalizePageCode = require('../../shared/normalizePageCode');
const { STAFF_ROLE } = require('../../shared/roles');

module.exports = ({ db }) => {
  async function editPage(req, res) {
    try {
      const {
        campaign,
        token,
        params: {
          code,
        },
        body: {
          title,
          subtitle,
          background,
        },
      } = req;

      const validationResult = validateAndNormalizeApiRequestFields({
        title,
        subtitle,
        background,
      });

      if (Array.isArray(validationResult)) {
        res.status(400).json({
          field: validationResult[0],
          error: validationResult[1],
        });

        return;
      }

      const backgroundFieldValidation = await validateBackgroundField(db, token, campaign, background);

      if (backgroundFieldValidation instanceof Error) {
        throw backgroundFieldValidation;
      }

      if (backgroundFieldValidation) {
        res.status(400).json(backgroundFieldValidation);
        return;
      }

      const existingPage = await getPageForCode(
        db,
        campaign._id.toString(),
        normalizePageCode(code),
      );

      if (existingPage instanceof Error) {
        throw existingPage;
      }

      if (!existingPage) {
        res.status(404).json({ error: 'This page does not exist' });
        return;
      }

      if (
        token.user.role !== STAFF_ROLE
        && existingPage.createdBy !== token.user._id.toString()
      ) {
        res.status(401).json({ error: 'Not authorized' });
        return;
      }

      const update = {
        ...validationResult,
        lastUpdatedAt: Date.now(),
      };

      const pages = db.collection('pages');

      await pages.updateOne(
        {
          code: normalizePageCode(code),
          campaign: campaign._id.toString(),
        },
        {
          '$set': update,
        },
      );

      res.json({ ok: true });
    } catch (error) {
      apiErrorHandler(res, error);
    }
  }

  return editPage;
}
