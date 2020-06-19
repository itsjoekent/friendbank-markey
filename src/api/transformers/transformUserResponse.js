module.exports = function transformUserResponse(user) {
  if (!user) {
    return null;
  }

  const {
    firstName,
    email,
    zip,
    emailFrequency,
    role,
  } = user;

  const safe = {
    firstName,
    email,
    zip,
    emailFrequency,
    role,
  };

  return safe;
}
