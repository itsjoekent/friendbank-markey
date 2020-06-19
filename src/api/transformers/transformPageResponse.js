module.exports = function transformPageResponse(page) {
  if (!page) {
    return null;
  }

  const {
    title,
    subtitle,
    background,
    code,
    media,
  } = page;

  const safe = {
    title,
    subtitle,
    background,
    code,
  };

  if (!!media) {
    safe.media = media;
  }

  return safe;
}
