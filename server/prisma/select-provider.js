/* Selects the Prisma provider from DB_PROVIDER: sqlite | postgresql (neon) | mysql | turso */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const fs = require('fs');
const path = require('path');

const MAP = { sqlite: 'sqlite', turso: 'sqlite', postgresql: 'postgresql', postgres: 'postgresql', neon: 'postgresql', mysql: 'mysql' };
const key = (process.env.DB_PROVIDER || 'sqlite').toLowerCase();
const provider = MAP[key];
if (!provider) {
  console.error(`Unknown DB_PROVIDER "${key}". Use one of: ${Object.keys(MAP).join(', ')}`);
  process.exit(1);
}
const tpl = fs.readFileSync(path.join(__dirname, 'schema.template.prisma'), 'utf8');
fs.writeFileSync(path.join(__dirname, 'schema.prisma'), tpl.replace('__PROVIDER__', provider));
console.log(`Prisma schema generated for DB_PROVIDER=${key} (provider ${provider})`);
