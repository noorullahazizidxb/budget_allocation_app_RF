import 'dotenv/config';
import { createApp } from './bootstrap';

createApp()
  .then((app) => app.listen(Number(process.env.PORT) || 4000))
  .then(() => console.log(`API listening on :${Number(process.env.PORT) || 4000}/api`));
