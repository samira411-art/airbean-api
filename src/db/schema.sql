-- Airbean databas

PRAGMA foreign_keys = ON;

-- Användare
CREATE TABLE IF NOT EXISTS users (
  id         TEXT PRIMARY KEY,   -- uuid
  username   TEXT NOT NULL UNIQUE,
  password   TEXT NOT NULL
);

-- Menyn
CREATE TABLE IF NOT EXISTS products (
  id          INTEGER PRIMARY KEY,
  title       TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  price       INTEGER NOT NULL
);

-- Om företaget
CREATE TABLE IF NOT EXISTS about (
  id          INTEGER PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT NOT NULL
);

-- Varukorg
CREATE TABLE IF NOT EXISTS carts (
  id       TEXT PRIMARY KEY,     -- uuid
  user_id  TEXT,                 -- NULL = gäst
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Produkter i varukorgen
CREATE TABLE IF NOT EXISTS cart_items (
  cart_id     TEXT NOT NULL,
  product_id  INTEGER NOT NULL,
  quantity    INTEGER NOT NULL,
  PRIMARY KEY (cart_id, product_id),
  FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Ordrar
CREATE TABLE IF NOT EXISTS orders (
  id           TEXT PRIMARY KEY,  -- uuid
  user_id      TEXT,              -- NULL = gäst
  total_price  INTEGER NOT NULL,
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  eta          TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Produkter i en order
CREATE TABLE IF NOT EXISTS order_items (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id    TEXT NOT NULL,
  product_id  INTEGER NOT NULL,
  quantity    INTEGER NOT NULL,
  price       INTEGER NOT NULL,   -- priset när man beställde
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);
