const { ObjectID } = require('mongodb');
const getPageForCode = require('../db/getPageForCode');
const apiErrorHandler = require('../utils/apiErrorHandler');
const validateAndNormalizeApiRequestFields = require('../utils/validateAndNormalizeApiRequestFields');
const transformPageResponse = require('../transformers/transformPageResponse');
const transformUserResponse = require('../transformers/transformUserResponse');
const { STAFF_ROLE } = require('../../shared/roles');

module.exports = ({ db }) => {
  async function adminGetPage(req, res) {
    try {
      const {
        campaign,
        params: {
          code,
        },
        token,
      } = req;

      if (token.user.role !== STAFF_ROLE) {
        res.status(401).json({ error: 'Only staff can access this' });
        return;
      }

      if (token.user.campaign !== campaign._id.toString()) {
        res.status(401).json({ error: 'Only staff can access this' });
        return;
      }

      const validationResult = validateAndNormalizeApiRequestFields({ code });

      if (Array.isArray(validationResult)) {
        res.status(400).json({
          field: validationResult[0],
          error: validationResult[1],
        });

        return;
      }

      const page = await getPageForCode(
        db,
        campaign._id.toString(),
        validationResult.code,
      );

      if (page instanceof Error) {
        throw page;
      }

      if (!page) {
        res.status(404).json({ error: 'Page not found' });
        return;
      }

      const createdBy = await db.collection('users').findOne({ _id: ObjectID(page.createdBy) });

      if (!createdBy) {
        res.status(400).json({ error: 'Error loading user that created this campaign' });
        return;
      }

      const basePage = transformPageResponse(page);
      const baseCreatedBy = transformUserResponse(createdBy);

      res.json({
        page: {
          ...basePage,
          createdBy: {
            ...baseCreatedBy,
            id: createdBy._id.toString(),
          },
        },
      });
    } catch (error) {
      apiErrorHandler(res, error);
    }
  }

  return adminGetPage;
}
