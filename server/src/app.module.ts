import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { BudgetModule } from './budget/budget.module';
import { HealthController } from './health.controller';
import { PrismaModule } from './prisma/prisma.module';

@Module({ imports: [PrismaModule, AuthModule, BudgetModule], controllers: [HealthController] })
export class AppModule {}
