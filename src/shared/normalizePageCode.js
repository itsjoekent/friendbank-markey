module.exports = function normalizePageCode(code) {
  return encodeURIComponent((code || '').trim().toLowerCase());
}
