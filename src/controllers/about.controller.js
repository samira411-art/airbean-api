import db from '../db/database.js';

// Info om företaget
export function getAbout(req, res) {
  const about = db.prepare('SELECT title, description FROM about').get();
  res.json({ success: true, about: about });
}
