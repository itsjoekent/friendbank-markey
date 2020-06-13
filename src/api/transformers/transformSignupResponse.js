module.exports = function transformSignupResponse(signup) {
  if (!signup) {
    return null;
  }

  const {
    _id,
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
    note,
  } = signup;

  const safe = {
    id: _id.toString(),
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
    note,
  };

  return safe;
}
