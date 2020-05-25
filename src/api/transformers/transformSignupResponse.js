module.exports = function transformSignupResponse(signup) {
  if (!signup) {
    return null;
  }

  const {
    code,
    firstName,
    lastName,
    email,
    phone,
    zip,
    supportLevel,
    volunteerLevel,
    type,
    lastUpdatedAt,
  } = signup;

  const safe = {
    code,
    firstName,
    lastName,
    email,
    phone,
    zip,
    supportLevel,
    volunteerLevel,
    type,
    lastUpdatedAt,
  };

  return safe;
}
