import db from '../db/database.js';

// Hela menyn
export function getMenu(req, res) {
  const menu = db.prepare('SELECT id, title, description AS desc, price FROM products').all();
  res.json({ success: true, menu: menu });
}

// En produkt
export function getProduct(req, res) {
  const product = db.prepare('SELECT id, title, description AS desc, price FROM products WHERE id = ?').get(req.params.id);

  if (!product) {
    return res.status(404).json({ success: false, error: 'Produkten finns inte' });
  }

  res.json({ success: true, product: product });
}

// Lägg till produkt
export function createProduct(req, res) {
  const { title, desc, price } = req.body;

  const exists = db.prepare('SELECT id FROM products WHERE title = ?').get(title);
  if (exists) {
    return res.status(409).json({ success: false, error: 'Det finns redan en produkt med det namnet' });
  }

  const result = db.prepare('INSERT INTO products (title, description, price) VALUES (?, ?, ?)').run(title, desc, price);

  const product = db.prepare('SELECT id, title, description AS desc, price FROM products WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ success: true, product: product });
}

// Ändra produkt
export function updateProduct(req, res) {
  const id = req.params.id;
  const { title, desc, price } = req.body;

  const product = db.prepare('SELECT id FROM products WHERE id = ?').get(id);
  if (!product) {
    return res.status(404).json({ success: false, error: 'Produkten finns inte' });
  }

  const sameName = db.prepare('SELECT id FROM products WHERE title = ? AND id != ?').get(title, id);
  if (sameName) {
    return res.status(409).json({ success: false, error: 'Det finns redan en produkt med det namnet' });
  }

  db.prepare('UPDATE products SET title = ?, description = ?, price = ? WHERE id = ?').run(title, desc, price, id);

  const updated = db.prepare('SELECT id, title, description AS desc, price FROM products WHERE id = ?').get(id);
  res.json({ success: true, product: updated });
}

// Ta bort produkt
export function deleteProduct(req, res) {
  const id = req.params.id;

  const product = db.prepare('SELECT id, title, description AS desc, price FROM products WHERE id = ?').get(id);
  if (!product) {
    return res.status(404).json({ success: false, error: 'Produkten finns inte' });
  }

  // Får inte tas bort om den finns i en order
  const inOrder = db.prepare('SELECT id FROM order_items WHERE product_id = ?').get(id);
  if (inOrder) {
    return res.status(409).json({ success: false, error: 'Produkten finns i ordrar och kan inte tas bort' });
  }

  db.prepare('DELETE FROM products WHERE id = ?').run(id);
  res.json({ success: true, deleted: product });
}
