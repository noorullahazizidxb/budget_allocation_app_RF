const { verifyRecaptcha, clientIp } = require('../lib/recaptcha');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'method not allowed' });
  }
  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
  const v = await verifyRecaptcha(body.token, body.action, clientIp(req));
  return res.status(v.status).json({ success: v.ok, score: v.score, action: v.action, errors: v.errors, error: v.error });
};
