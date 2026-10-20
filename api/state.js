const { getSql, ensureSchema, readState } = require('../lib/db');

module.exports = async (req, res) => {
  try {
    if (req.method === 'GET') return res.status(200).json(await readState());
    if (req.method === 'PUT') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      await ensureSchema();
      const q = getSql();
      if (body.budget !== undefined || body.currency !== undefined) {
        const budget = Number(body.budget);
        if (body.budget !== undefined && (!Number.isFinite(budget) || budget < 0))
          return res.status(400).json({ error: 'invalid budget' });
        await q`UPDATE budget_settings SET
          budget = COALESCE(${body.budget === undefined ? null : budget}, budget),
          currency = COALESCE(${typeof body.currency === 'string' ? body.currency.slice(0, 8) : null}, currency),
          updated_at = now() WHERE id = 1`;
      }
      if (Array.isArray(body.expenses)) {
        for (let i = 0; i < body.expenses.length; i++) {
          const e = body.expenses[i];
          const cost = Number(e.cost);
          if (!e.name || !Number.isFinite(cost) || cost < 0) continue;
          await q`INSERT INTO expenses (name, cost, position) VALUES (${String(e.name).slice(0, 100)}, ${cost}, ${i})
            ON CONFLICT (name) DO UPDATE SET cost = EXCLUDED.cost, updated_at = now()`;
        }
      }
      return res.status(200).json(await readState());
    }
    res.setHeader('Allow', 'GET, PUT');
    return res.status(405).json({ error: 'method not allowed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
