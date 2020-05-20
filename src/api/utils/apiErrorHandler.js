const DEFAULT_API_ERROR_MESSAGE = 'Server error';

module.exports = function apiErrorHandler(res, error) {
  console.error(error);

  if (error && error._status) {
    res.status(error._status).json({ error: error.safeMessage || DEFAULT_API_ERROR_MESSAGE });
    return;
  }

  res.status(500).json({ error: DEFAULT_API_ERROR_MESSAGE });
}
