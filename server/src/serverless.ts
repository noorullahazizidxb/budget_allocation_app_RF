import type { IncomingMessage, ServerResponse } from 'http';
import { createApp } from './bootstrap';
import { registerGracefulShutdown } from './common/shutdown';

/** Vercel / serverless entry: boots Nest once per warm instance and reuses the Express handler. */
let handler: ((req: IncomingMessage, res: ServerResponse) => void) | undefined;

export default async function serverless(req: IncomingMessage, res: ServerResponse) {
  if (!handler) {
    const app = await createApp();
    await app.init();
    // Vercel sends SIGTERM before an instance is torn down and allows ~500ms for cleanup.
    registerGracefulShutdown({ cleanups: [() => app.close()], timeoutMs: 400 });
    handler = app.getHttpAdapter().getInstance();
  }
  handler!(req, res);
}
