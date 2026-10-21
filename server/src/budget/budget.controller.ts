import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthUser, CurrentUser } from '../common/current-user.decorator';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import {
  CreateAllocationDto, createAllocationSchema, CreateExpenseDto, createExpenseSchema,
  UpdateAllocationDto, updateAllocationSchema, UpdateBudgetDto, updateBudgetSchema,
} from './budget.schemas';
import { BudgetService } from './budget.service';

@Controller('budget')
@UseGuards(JwtAuthGuard)
export class BudgetController {
  constructor(private readonly budget: BudgetService) {}

  @Get()
  overview(@CurrentUser() u: AuthUser) {
    return this.budget.overview(u.id);
  }

  @Patch()
  update(@CurrentUser() u: AuthUser, @Body(new ZodValidationPipe(updateBudgetSchema)) dto: UpdateBudgetDto) {
    return this.budget.updateSettings(u.id, dto);
  }

  @Post('allocations')
  createAllocation(@CurrentUser() u: AuthUser, @Body(new ZodValidationPipe(createAllocationSchema)) dto: CreateAllocationDto) {
    return this.budget.createAllocation(u.id, dto);
  }

  @Patch('allocations/:id')
  updateAllocation(@CurrentUser() u: AuthUser, @Param('id') id: string, @Body(new ZodValidationPipe(updateAllocationSchema)) dto: UpdateAllocationDto) {
    return this.budget.updateAllocation(u.id, id, dto);
  }

  @Delete('allocations/:id')
  deleteAllocation(@CurrentUser() u: AuthUser, @Param('id') id: string) {
    return this.budget.deleteAllocation(u.id, id);
  }

  @Post('allocations/:id/expenses')
  addExpense(@CurrentUser() u: AuthUser, @Param('id') id: string, @Body(new ZodValidationPipe(createExpenseSchema)) dto: CreateExpenseDto) {
    return this.budget.addExpense(u.id, id, dto);
  }

  @Get('expenses')
  recent(@CurrentUser() u: AuthUser) {
    return this.budget.recentExpenses(u.id);
  }

  @Delete('expenses/:id')
  deleteExpense(@CurrentUser() u: AuthUser, @Param('id') id: string) {
    return this.budget.deleteExpense(u.id, id);
  }
}
