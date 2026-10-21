import { Module } from '@nestjs/common';
import { BudgetController } from './budget.controller';
import { BudgetRepository } from './budget.repository';
import { BudgetService } from './budget.service';

@Module({ controllers: [BudgetController], providers: [BudgetService, BudgetRepository] })
export class BudgetModule {}
