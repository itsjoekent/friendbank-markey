module.exports = function transformPageResponse(page) {
  if (!page) {
    return null;
  }

  const {
    title,
    subtitle,
    background,
    code,
  } = page;

  const safe = {
    title,
    subtitle,
    background,
    code,
  };

  return safe;
}
