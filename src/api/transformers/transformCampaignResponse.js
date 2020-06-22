module.exports = function transformCampaignResponse(campaign) {
  if (!campaign) {
    return null;
  }

  const {
    domains,
    name,
    copy,
    config,
    updateLog,
    lastUpdatedAt,
  } = campaign;

  const safe = {
    domains,
    name,
    copy,
    config,
    lastUpdatedAt,
  };

  if (!!updateLog) {
    safe.updateLog = updateLog.map((log) => ({
      updatedAt: log.updatedAt,
      updatedBy: log.updatedBy,
      note: log.note,
    }));
  }

  return safe;
}
