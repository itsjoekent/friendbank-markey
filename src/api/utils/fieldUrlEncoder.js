module.exports = function fieldUrlEncoder(fields) {
  const encoded = Object.keys(fields).reduce((acc, key) => {
    const prepend = acc.length ? '&' : '';

    return `${acc}${prepend}${encodeURIComponent(key)}=${encodeURIComponent(fields[key])}`;
  }, '');

  return encoded;
}
