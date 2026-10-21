// Vercel serverless function: runs the NestJS app (server/) via its serverless entry.
// All /api/* requests are rewritten here by vercel.json; Nest routes them under its global "api" prefix.
module.exports = require('../server/dist/serverless.js').default;
