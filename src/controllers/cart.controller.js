import { v4 as uuidv4 } from 'uuid';
import db from '../db/database.js';

// Hämta korgen med produkter och totalsumma
function getCartData(cartId) {
  const cart = db.prepare('SELECT * FROM carts WHERE id = ?').get(cartId);
  if (!cart) {
    return null;
  }

  const items = db.prepare(`
    SELECT products.id, products.title, products.price, cart_items.quantity
    FROM cart_items
    JOIN products ON products.id = cart_items.product_id
    WHERE cart_items.cart_id = ?
  `).all(cartId);

  let total = 0;
  for (const item of items) {
    total = total + item.price * item.quantity;
  }

  return { cartId: cart.id, userId: cart.user_id, items: items, total: total };
}

// Skapa en tom korg
export function createCart(req, res) {
  const cartId = uuidv4();
  const userId = req.body.userId || null;

  db.prepare('INSERT INTO carts (id, user_id) VALUES (?, ?)').run(cartId, userId);

  res.status(201).json({ success: true, cart: getCartData(cartId) });
}

// Visa korgen
export function getCart(req, res) {
  const cart = getCartData(req.params.cartId);

  if (!cart) {
    return res.status(404).json({ success: false, error: 'Varukorgen finns inte' });
  }

  res.json({ success: true, cart: cart });
}

// Lägg till en produkt
export function addItem(req, res) {
  const cartId = req.params.cartId;
  const { id, quantity } = req.body;

  if (!getCartData(cartId)) {
    return res.status(404).json({ success: false, error: 'Varukorgen finns inte' });
  }

  const existing = db.prepare('SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?').get(cartId, id);

  // Finns den redan: öka antalet
  if (existing) {
    db.prepare('UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND product_id = ?')
      .run(existing.quantity + quantity, cartId, id);
  } else {
    db.prepare('INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)')
      .run(cartId, id, quantity);
  }

  res.json({ success: true, cart: getCartData(cartId) });
}

// Ta bort en produkt
export function removeItem(req, res) {
  const cartId = req.params.cartId;
  const productId = req.params.id;

  if (!getCartData(cartId)) {
    return res.status(404).json({ success: false, error: 'Varukorgen finns inte' });
  }

  const result = db.prepare('DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?').run(cartId, productId);

  if (result.changes === 0) {
    return res.status(404).json({ success: false, error: 'Produkten finns inte i varukorgen' });
  }

  res.json({ success: true, cart: getCartData(cartId) });
}
