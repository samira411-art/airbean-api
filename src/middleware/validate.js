import { validate as isUuid } from 'uuid';
import db from '../db/database.js';
import config from '../config.js';

// Skicka ett fel
function sendError(res, message) {
  return res.status(400).json({ success: false, error: message });
}

// Kolla id:n i URL:en
// :id ska vara ett tal, :cartId, :orderId och :userId ska vara uuid
export function checkIdParams(req, res, next) {
  for (const name in req.params) {
    const value = req.params[name];

    if (name === 'id') {
      if (!Number.isInteger(Number(value)) || Number(value) < 1) {
        return sendError(res, 'id måste vara ett positivt heltal');
      }
    } else if (!isUuid(value)) {
      return sendError(res, name + ' måste vara ett giltigt uuid');
    }
  }
  next();
}

// Ny korg: { userId } eller tom body
export function checkCart(req, res, next) {
  const userId = req.body.userId;

  // Gäst
  if (userId === undefined) {
    return next();
  }

  if (!isUuid(userId)) {
    return sendError(res, 'userId måste vara ett giltigt uuid');
  }

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
  if (!user) {
    return sendError(res, 'Användaren finns inte');
  }

  next();
}

// Lägg i korgen: { id, price, quantity }
export function checkCartItem(req, res, next) {
  const { id, price, quantity } = req.body;

  if (!Number.isInteger(id)) {
    return sendError(res, 'id måste vara ett heltal');
  }

  if (typeof price !== 'number') {
    return sendError(res, 'price måste vara ett tal');
  }

  if (!Number.isInteger(quantity) || quantity < 1 || quantity > config.maxQuantity) {
    return sendError(res, 'quantity måste vara ett heltal mellan 1 och ' + config.maxQuantity);
  }

  // Finns produkten i menyn?
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
  if (!product) {
    return sendError(res, 'Produkten finns inte i menyn');
  }

  // Stämmer priset?
  if (price !== product.price) {
    return sendError(res, 'Fel pris för ' + product.title + ', ska vara ' + product.price + ' kr');
  }

  next();
}

// Konto: { username, password }
export function checkUser(req, res, next) {
  const { username, password } = req.body;

  if (typeof username !== 'string' || username.length < config.usernameMin) {
    return sendError(res, 'username måste vara minst ' + config.usernameMin + ' tecken');
  }

  if (typeof password !== 'string' || password.length < config.passwordMin) {
    return sendError(res, 'password måste vara minst ' + config.passwordMin + ' tecken');
  }

  next();
}

// Produkt: { title, desc, price }
export function checkProduct(req, res, next) {
  const { title, desc, price } = req.body;

  if (typeof title !== 'string' || title === '') {
    return sendError(res, 'title måste vara text');
  }

  if (typeof desc !== 'string' || desc === '') {
    return sendError(res, 'desc måste vara text');
  }

  if (!Number.isInteger(price) || price < 1) {
    return sendError(res, 'price måste vara ett positivt heltal');
  }

  next();
}

// Ny order: { cartId }
export function checkOrder(req, res, next) {
  const cartId = req.body.cartId;

  if (!isUuid(cartId)) {
    return sendError(res, 'cartId måste vara ett giltigt uuid');
  }

  const cart = db.prepare('SELECT * FROM carts WHERE id = ?').get(cartId);
  if (!cart) {
    return sendError(res, 'Varukorgen finns inte');
  }

  const items = db.prepare('SELECT * FROM cart_items WHERE cart_id = ?').all(cartId);
  if (items.length === 0) {
    return sendError(res, 'Varukorgen är tom');
  }

  next();
}
