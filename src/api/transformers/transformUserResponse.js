module.exports = function transformUserResponse(user) {
  if (!user) {
    return null;
  }

  const {
    firstName,
    email,
    zip,
    emailFrequency,
  } = user;

  const safe = {
    firstName,
    email,
    zip,
    emailFrequency,
  };

  return safe;
}
