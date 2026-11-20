export function badJson(err, req, res, next) {
  res.status(400).json({ success: false, error: 'Body är inte giltig JSON' });
}

// Sidan finns inte
export function notFound(req, res) {
  res.status(404).json({ success: false, error: 'Sidan finns inte' });
}

// Något gick fel i koden
export function serverError(err, req, res, next) {
  console.error(err);
  res.status(500).json({ success: false, error: 'Något gick fel på servern' });
}
