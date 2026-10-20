const { neon } = require('@neondatabase/serverless');

let sql;
let ready;

function getSql() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
  if (!sql) sql = neon(process.env.DATABASE_URL);
  return sql;
}

const DEFAULT_EXPENSES = ['Marketing', 'Finance', 'Sales', 'Human Resource', 'IT'];

async function ensureSchema() {
  if (!ready) {
    ready = (async () => {
      const q = getSql();
      await q`CREATE TABLE IF NOT EXISTS budget_settings (
        id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
        budget NUMERIC NOT NULL DEFAULT 0,
        currency TEXT NOT NULL DEFAULT '$',
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now())`;
      await q`CREATE TABLE IF NOT EXISTS expenses (
        name TEXT PRIMARY KEY,
        cost NUMERIC NOT NULL DEFAULT 0 CHECK (cost >= 0),
        position INT NOT NULL DEFAULT 0,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now())`;
      await q`INSERT INTO budget_settings (id) VALUES (1) ON CONFLICT DO NOTHING`;
      for (let i = 0; i < DEFAULT_EXPENSES.length; i++) {
        await q`INSERT INTO expenses (name, position) VALUES (${DEFAULT_EXPENSES[i]}, ${i}) ON CONFLICT DO NOTHING`;
      }
    })().catch((e) => { ready = undefined; throw e; });
  }
  return ready;
}

async function readState() {
  await ensureSchema();
  const q = getSql();
  const [s] = await q`SELECT budget, currency FROM budget_settings WHERE id = 1`;
  const rows = await q`SELECT name, cost FROM expenses ORDER BY position, name`;
  return {
    budget: Number(s.budget),
    currency: s.currency,
    expenses: rows.map((r) => ({ id: r.name, name: r.name, cost: Number(r.cost) })),
  };
}

module.exports = { getSql, ensureSchema, readState };
