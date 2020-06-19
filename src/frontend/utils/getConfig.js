export default function getConfig(key, fallback = null) {
  const config = window.__CAMPAIGN_CONFIG;
  const value = config[key];

  if (typeof value === 'undefined') {
    return fallback;
  }

  return value;
}
