export default async function getSignupInitialProps({
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
      createdBy,
    } = page;

    const createdByUser = await db.collection('users')
      .findOne({ _id: ObjectId(createdBy) });

    const createdByFirstName = createdByUser.firstName;

    const mediaCollection = db.collection('media');
    const media = await mediaCollection.findOne({ _id: background });

    return {
      page: {
        code: normalizedCode,
        title,
        subtitle,
        background,
        createdByFirstName,
        media,
      },
    };
  } catch (error) {
    return error;
  }
}
