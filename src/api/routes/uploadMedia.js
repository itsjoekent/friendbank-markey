const aws = require('aws-sdk');
const mime = require('mime-types');
const apiErrorHandler = require('../utils/apiErrorHandler');
const { randomToken } = require('../utils/auth');
const { STAFF_ROLE } = require('../../shared/roles');

const { S3_BUCKET } = process.env;

module.exports = ({ db }) => {
  async function uploadMedia(req, res) {
    try {
      const {
        token,
        body: {
          alt,
          fileType,
        },
      } = req;

      if (token.user.role !== STAFF_ROLE) {
        res.status(401).json({ error: 'Only staff can upload custom media' });
        return;
      }

      if (!alt || typeof alt !== 'string') {
        res.status(400).json({
          field: 'alt',
          error: 'validations.required',
        });

        return;
      }

      if (!fileType || typeof fileType !== 'string') {
        res.status(400).json({
          field: 'background',
          error: 'validations.required',
        });

        return;
      }

      const contentType = mime.lookup(fileType);

      if (!contentType || !contentType.startsWith('image/')) {
        res.status(400).json({
          field: 'background',
          error: 'validations.required',
        });

        return;
      }

      const _id = await randomToken(16);
      const fileName = `${_id}.${fileType}`;

      const media = {
        _id,
        alt,
        type: 'image',
        source: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
      };

      const mediaCollection = db.collection('media');
      await mediaCollection.insertOne(media);

      const s3 = new aws.S3();
      const s3Params = {
        Bucket: S3_BUCKET,
        Key: fileName,
        Expires: 60,
        ContentType: contentType,
        ACL: 'public-read'
      };

      const signedUrl = await s3.getSignedUrl('putObject', s3Params);

      res.json({
        media,
        signedUrl,
      });
    } catch (error) {
      apiErrorHandler(res, error);
    }
  }

  return uploadMedia;
}
