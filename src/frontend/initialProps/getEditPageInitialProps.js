export default async function getEditPageInitialProps({
  routeMatch,
  db,
  ObjectId,
  campaign,
}) {
  try {
    const { code } = routeMatch;
    const normalizedCode = normalizePageCode(code);

    const campaignId = campaign._id.toString();

    const pages = db.collection('pages');

    const page = await pages.findOne({
      code: normalizedCode,
      campaign: campaignId,
    });

    if (!page) {
      return {};
    }

    const {
      title,
      subtitle,
      background,
    } = page;

    const config = JSON.parse(campaign.config);

    const mediaCollection = db.collection('media');
    const campaignMedia = await mediaCollection
      .find({ _id: { '$in': config.media } })
      .toArray();

    const pageMedia = await mediaCollection.findOne({ _id: background });

    return {
      page: {
        code: normalizedCode,
        title,
        subtitle,
        background,
        media: pageMedia,
      },
      campaignMedia,
    };
  } catch (error) {
    return error;
  }
}
