import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import db from '../db/database.js';
import { getOrderData } from './orders.controller.js';

// Skapa konto
export function signup(req, res) {
  const { username, password } = req.body;

  const exists = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
  if (exists) {
    return res.status(409).json({ success: false, error: 'Användarnamnet är redan taget' });
  }

  const userId = uuidv4();
  const hashedPassword = bcrypt.hashSync(password, 10);

  db.prepare('INSERT INTO users (id, username, password) VALUES (?, ?, ?)').run(userId, username, hashedPassword);

  res.status(201).json({ success: true, user: { userId: userId, username: username } });
}

// Logga in
export function login(req, res) {
  const { username, password } = req.body;

  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ success: false, error: 'Fel användarnamn eller lösenord' });
  }

  res.json({ success: true, user: { userId: user.id, username: user.username } });
}

// Orderhistorik
export function getOrderHistory(req, res) {
  const userId = req.params.userId;

  const user = db.prepare('SELECT id FROM users WHERE id = ?').get(userId);
  if (!user) {
    return res.status(404).json({ success: false, error: 'Användaren finns inte' });
  }

  const rows = db.prepare('SELECT id FROM orders WHERE user_id = ? ORDER BY created_at DESC').all(userId);

  const orders = [];
  for (const row of rows) {
    orders.push(getOrderData(row.id));
  }

  res.json({ success: true, orders: orders });
}
