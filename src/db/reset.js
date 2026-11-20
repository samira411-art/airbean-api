// Tar bort databasen
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import config from '../config.js';

const folder = path.dirname(fileURLToPath(import.meta.url));
const dbFile = path.join(folder, config.dbFile);

if (fs.existsSync(dbFile)) {
  fs.unlinkSync(dbFile);
}
console.log('Databasen är borttagen');
