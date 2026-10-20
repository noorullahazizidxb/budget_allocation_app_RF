const { getSql, ensureSchema } = require('../lib/db');

module.exports = async (req, res) => {
  try {
    await ensureSchema();
    const [r] = await getSql()`SELECT now() AS now, (SELECT count(*) FROM expenses)::int AS expenses`;
    res.status(200).json({ ok: true, db: 'connected', ...r });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};
