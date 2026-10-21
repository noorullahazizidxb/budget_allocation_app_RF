import type { IncomingMessage, ServerResponse } from 'http';
import { createApp } from './bootstrap';

/** Vercel / serverless entry: boots Nest once per warm instance and reuses the Express handler. */
let handler: ((req: IncomingMessage, res: ServerResponse) => void) | undefined;

export default async function serverless(req: IncomingMessage, res: ServerResponse) {
  if (!handler) {
    const app = await createApp();
    await app.init();
    handler = app.getHttpAdapter().getInstance();
  }
  handler!(req, res);
}
