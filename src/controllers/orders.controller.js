import { v4 as uuidv4 } from 'uuid';
import db from '../db/database.js';
import config from '../config.js';

// Hämta en order med produkter
export function getOrderData(orderId) {
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
  if (!order) {
    return null;
  }

  const items = db.prepare(`
    SELECT products.id, products.title, order_items.price, order_items.quantity
    FROM order_items
    JOIN products ON products.id = order_items.product_id
    WHERE order_items.order_id = ?
  `).all(orderId);

  return {
    orderId: order.id,
    userId: order.user_id,
    items: items,
    totalPrice: order.total_price,
    createdAt: order.created_at,
    eta: order.eta,
  };
}

// Gör en order av varukorgen
export function createOrder(req, res) {
  const cartId = req.body.cartId;
  const cart = db.prepare('SELECT * FROM carts WHERE id = ?').get(cartId);

  const items = db.prepare(`
    SELECT cart_items.product_id, cart_items.quantity, products.price
    FROM cart_items
    JOIN products ON products.id = cart_items.product_id
    WHERE cart_items.cart_id = ?
  `).all(cartId);

  let total = 0;
  for (const item of items) {
    total = total + item.price * item.quantity;
  }

  // Spara ordern
  const orderId = uuidv4();
  const eta = '+' + config.deliveryMinutes + ' minutes';

  db.prepare("INSERT INTO orders (id, user_id, total_price, eta) VALUES (?, ?, ?, datetime('now', ?))")
    .run(orderId, cart.user_id, total, eta);

  // Spara produkterna i ordern
  for (const item of items) {
    db.prepare('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)')
      .run(orderId, item.product_id, item.quantity, item.price);
  }

  // Ta bort korgen
  db.prepare('DELETE FROM carts WHERE id = ?').run(cartId);

  res.status(201).json({ success: true, order: getOrderData(orderId) });
}

// Visa en order
export function getOrder(req, res) {
  const order = getOrderData(req.params.orderId);

  if (!order) {
    return res.status(404).json({ success: false, error: 'Ordern finns inte' });
  }

  res.json({ success: true, order: order });
}
