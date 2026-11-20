import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import config from '../config.js';

// Mappen som den här filen ligger i (src/db)
// Då hittas filerna oavsett var man startar servern
const folder = path.dirname(fileURLToPath(import.meta.url));

const db = new Database(path.join(folder, config.dbFile));
db.pragma('foreign_keys = ON');

// Läs en fil i src/db
function readFile(name) {
  return fs.readFileSync(path.join(folder, name), 'utf8');
}

// Skapa tabellerna
db.exec(readFile('schema.sql'));

// Lägg in menyn första gången
const products = db.prepare('SELECT * FROM products').all();

if (products.length === 0) {
  const data = JSON.parse(readFile('menu.json'));

  for (const product of data.menu) {
    db.prepare('INSERT INTO products (id, title, description, price) VALUES (?, ?, ?, ?)')
      .run(product.id, product.title, product.desc, product.price);
  }
}

// Lägg in om-texten första gången
const about = db.prepare('SELECT * FROM about').get();

if (!about) {
  const data = JSON.parse(readFile('about.json'));

  db.prepare('INSERT INTO about (id, title, description) VALUES (1, ?, ?)')
    .run(data.title, data.description);
}

export default db;
