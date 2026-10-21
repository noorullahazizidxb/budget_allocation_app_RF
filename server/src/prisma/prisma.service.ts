import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/** Builds a PrismaClient for the configured DB_PROVIDER (Turso uses the libSQL driver adapter). */
export function createPrismaOptions(): ConstructorParameters<typeof PrismaClient>[0] {
  if ((process.env.DB_PROVIDER || '').toLowerCase() !== 'turso') return {};
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { createClient } = require('@libsql/client');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { PrismaLibSQL } = require('@prisma/adapter-libsql');
  const libsql = createClient({ url: process.env.TURSO_DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });
  return { adapter: new PrismaLibSQL(libsql) } as never;
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  constructor() {
    super(createPrismaOptions());
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
