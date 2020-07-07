export default async function getHomepageInitialProps({
  db,
  campaign,
}) {
  try {
    const config = JSON.parse(campaign.config);

    const mediaCollection = db.collection('media');
    const campaignMedia = await mediaCollection
      .find({ _id: { '$in': config.media } })
      .toArray();

    return {
      campaignMedia,
    }
  } catch (error) {
    return error;
  }
}
