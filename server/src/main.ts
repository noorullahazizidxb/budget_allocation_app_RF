import 'dotenv/config';
import { createApp } from './bootstrap';
import { registerGracefulShutdown } from './common/shutdown';

const port = Number(process.env.PORT) || 4000;

createApp()
  .then(async (app) => {
    await app.listen(port);
    // app.close() stops the HTTP server (in-flight requests finish) and runs onModuleDestroy hooks (Prisma).
    registerGracefulShutdown({
      cleanups: [() => app.close()],
      timeoutMs: Number(process.env.SHUTDOWN_TIMEOUT_MS) || 10_000,
    });
  })
  .then(() => console.log(`API listening on :${port}/api`));
